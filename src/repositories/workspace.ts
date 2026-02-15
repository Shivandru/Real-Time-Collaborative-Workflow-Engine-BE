import MongoConnection from "../config/db.ts";
import { workspaceSchema, type AddMembers, type RemoveMember, type RenameWorkspace, type UpdateOwner, type WorkSpace } from "../schemas/workspace.ts";
import { NotFoundException } from "../utils/exceptions/client.ts";
import { InternalServerErrorException } from "../utils/exceptions/server.ts";


class WorkSpaceRepository {

    private get collection(){
        return MongoConnection.getInstance().getDb().collection<WorkSpace>("workspaces");
    }

    async create(workspace: WorkSpace): Promise<void>{
        try {
            await this.collection.insertOne(workspace);
        } catch (error) {
            throw new InternalServerErrorException(error instanceof Error ? error.message: "Internal Server Error");
        }
    }

    async getWorkSpaces(): Promise<WorkSpace[] | []> {
        try {
            const workspaces = await this.collection.find().toArray();
            return workspaces.length > 0 ? workspaces : [];
        } catch (error) {
            throw new InternalServerErrorException(error instanceof Error ? error.message: "Internal Server Error");
        }
    }

    async getWorkSpace(workspaceId: string): Promise<WorkSpace | null>{
        try {
            const workspace = await this.collection.findOne({workspaceId}, { projection: { _id: 0 } });
            return workspace ?  workspaceSchema.parse(workspace) : null;
        } catch (error) {
            throw new InternalServerErrorException(error instanceof Error ? error.message: "Internal Server Error");
        }
    }

    async renameWorkspace({workspaceId, title, createdBy}: RenameWorkspace): Promise<WorkSpace | null>{
        try {
            const updateQuery: any = {};
            updateQuery.$set = { title };
            const updated = await this.collection.findOneAndUpdate({workspaceId, createdBy}, updateQuery, {
                returnDocument: "after",
                projection: { _id: 0 }
            })
            return updated ?? null;
        } catch (error) {
            throw new InternalServerErrorException(error instanceof Error ? error.message: "Internal Server Error");
        }
    }

    async addMembers({workspaceId, members, createdBy}: AddMembers): Promise<WorkSpace | null>{
        try {
            const updateQuery: any = {};
            updateQuery.$addToSet = { members: { $each: members } };
            const updated = await this.collection.findOneAndUpdate({workspaceId, createdBy}, updateQuery, {
                returnDocument: "after",
                projection: { _id: 0 }
            })
            return updated ?? null;
        } catch (error) {
            throw new InternalServerErrorException(error instanceof Error ? error.message: "Internal Server Error");
        }
    }

    async removeMembers({workspaceId, member, createdBy}: RemoveMember): Promise<void>{
        try {
            const updated = await this.collection.updateOne({
                workspaceId,
                createdBy,
                members: member
            },{
                $pull: {members: member}
            })
            if(updated.modifiedCount === 0){
                throw new NotFoundException("Member not found");
            }
        } catch (error) {
            throw new InternalServerErrorException(error instanceof Error ? error.message: "Internal Server Error");
        }
    }

    async updateWorkspaceOwner({workspaceId, createdBy, newOwner}: UpdateOwner): Promise<void>{
        try {
            const updated = await this.collection.updateOne({
                workspaceId,
                createdBy,
                members: newOwner
            }, {
                $set: { createdBy: newOwner }
            });
            if(updated.modifiedCount === 0){
                throw new NotFoundException("Workspace not found");
            }
        } catch (error) {
            throw new InternalServerErrorException(error instanceof Error ? error.message: "Internal Server Error");
        }
    }

    async deleteWorkspace({workspaceId, createdBy}:{workspaceId: string, createdBy: string}): Promise<boolean>{
        try {
            const result = await this.collection.findOneAndDelete({ workspaceId, createdBy });
            return !!result;
        } catch (error) {
            throw new InternalServerErrorException(error instanceof Error ? error.message: "Internal Server Error");
        }
    }
}

export const workSpaceRepository = new WorkSpaceRepository();
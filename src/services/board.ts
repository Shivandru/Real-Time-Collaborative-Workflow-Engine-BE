import { boardRepository } from "../repositories/board.ts";
import { boardSchema, type Board, type ChangeBoardVisibility, type CreateBoard, type DeleteBoard, type RenameBoard } from "../schemas/board.ts";
import { BadRequestException } from "../utils/exceptions/client.ts";
import { InternalServerErrorException } from "../utils/exceptions/server.ts";
import {v4 as uuid} from "uuid";
import { activityServices } from "./activity.ts";
import { workSpaceServices } from "./workspace.ts";

class BoardServices {
    async createBoard({ title, workspaceId, visibility, createdBy }: CreateBoard):Promise<Board>{
        try {
            if(!workspaceId || !title || !visibility || !createdBy){
                throw new BadRequestException("missing required fields");
            }
            const workSpace = await workSpaceServices.getWorkSpace(workspaceId);
            if(!workSpace){
                throw new BadRequestException("Workspace not found");
            }
            const isMember = workSpace.members.includes(createdBy);
            if(!isMember){
                throw new BadRequestException("You are not a member of this workspace");
            }
            const newBoard: Board = {
                boardId: `b-${uuid()}`,
                title,
                workspaceId,
                visibility,
                createdBy,
                createdAt: new Date().toISOString(),
            }
            await boardRepository.createBoard(newBoard);
            await activityServices.createActivity({
                workspaceId,
                boardId: newBoard.boardId,
                type: "BoardCreated",
                actor: newBoard.createdBy,
                payload: {
                    title: "Board created"
                }
            })
            return boardSchema.parse(newBoard);
        } catch (error) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async getBoards(workspaceId: string):Promise<Board[]>{
        try {
            if(!workspaceId){
                throw new BadRequestException("missing required fields");
            }
            const boards = await boardRepository.getBoards(workspaceId);
            return boards;
        } catch (error) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async getBoard(boardId: string, workspaceId: string):Promise<Board | null>{
        try {
            if(!workspaceId || !boardId){
                throw new BadRequestException("missing required fields");
            }
            const board = await boardRepository.getBoard(boardId, workspaceId);
            return board;
        } catch (error) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async deleteBoard({ boardId, workspaceId, createdBy }: DeleteBoard):Promise<boolean>{
        try {
            if(!workspaceId || !boardId){
                throw new BadRequestException("missing required fields");
            }
            const deleted = await boardRepository.deleteBoard({ boardId, workspaceId, createdBy });
            await activityServices.createActivity({
                workspaceId,
                boardId: boardId,
                type: "BoardDeleted",
                actor: createdBy,
                payload: {
                    title: "Board deleted"
                }
            })
            return deleted;
        } catch (error) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async updateVisibility({ boardId, workspaceId, createdBy, visibility }: ChangeBoardVisibility):Promise<Board | null>{
        try {
            const board = await boardRepository.updateVisibility({ boardId, workspaceId, createdBy, visibility });
            await activityServices.createActivity({
                workspaceId,
                boardId: boardId,
                type: "BoardVisibilityUpdated",
                actor: createdBy,
                payload: {
                    title: "Board visibility updated"
                }
            })
            return board;
        } catch (error) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async renameBoard({ boardId, workspaceId, createdBy, title }: RenameBoard):Promise<Board | null>{
        try {
            const board = await boardRepository.renameBoard({ boardId, workspaceId, createdBy, title });
            await activityServices.createActivity({
                workspaceId,
                boardId: boardId,
                type: "BoardRenamed",
                actor: createdBy,
                payload: {
                    title: "Board renamed"
                }
            })
            return board;
        } catch (error) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

}

export const boardServices = new BoardServices();
import MongoConnection from "../config/db.ts";
import type { BoardList, RenameBoardList } from "../schemas/boardList.ts";
import { InternalServerErrorException } from "../utils/exceptions/server.ts";

class BoardListRepository {
    private get collection() {
        return MongoConnection.getInstance().getDb().collection<BoardList>("boardLists");
    }
    async createBoardList(boardList: BoardList): Promise<void> {
        try {
            await this.collection.insertOne(boardList);
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    async getBoardLists(workspaceId: string, boardId: string): Promise<BoardList[]> {
        try {
            const boardLists = await this.collection.find({ workspaceId, boardId }).toArray();
            return boardLists;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    async renameBoardList({ boardListId, workspaceId, boardId, title }: RenameBoardList): Promise<BoardList | null> {
        try {
            const updated = await this.collection.findOneAndUpdate(
                {
                    boardListId,
                    workspaceId,
                    boardId,
                },
                {
                    $set: {
                        title,
                    },
                },
                {
                    returnDocument: "after",
                    projection: { _id: 0 },
                },
            );
            return updated ?? null;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    async deleteBoardList(boardListId: string, workspaceId: string, boardId: string): Promise<boolean> {
        try {
            const deleted = await this.collection.deleteOne({ boardListId, workspaceId, boardId });
            return !!deleted;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }
}

export const boardListRepository = new BoardListRepository();

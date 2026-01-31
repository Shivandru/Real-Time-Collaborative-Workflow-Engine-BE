import MongoConnection from "../config/db.ts";
import { boardSchema, type Board, type ChangeBoardVisibility, type DeleteBoard, type RenameBoard } from "../schemas/board.ts";
import { InternalServerErrorException } from "../utils/exceptions/server.ts";

class BoardRepository {
    private get collection() {
        return MongoConnection.getInstance().getDb().collection<Board>("boards");
    }
    async createBoard(board: Board): Promise<void> {
        try {
            await this.collection.insertOne(board);
        } catch (error) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async getBoards(workspaceId: string): Promise<Board[]> {
        try {
            const boards = await this.collection.find({ workspaceId }).toArray();
            return boards;
        } catch (error) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async getBoard(boardId: string, workspaceId: string): Promise<Board | null> {
        try {
            const board = await this.collection.findOne({ boardId, workspaceId });
            return board ? boardSchema.parse(board) : null;
        } catch (error) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async renameBoard({ boardId, workspaceId, createdBy, title }: RenameBoard): Promise<Board | null> {
        try {
            const updatedBoard = await this.collection.findOneAndUpdate(
                {
                    boardId,
                    workspaceId,
                    createdBy,
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
            return updatedBoard ?? null;
        } catch (error) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async updateVisibility({ boardId, workspaceId, createdBy, visibility }: ChangeBoardVisibility): Promise<Board | null> {
        try {
            const board = await this.collection.findOneAndUpdate(
                {
                    workspaceId,
                    boardId,
                    createdBy,
                },
                {
                    $set: {
                        visibility,
                    },
                },
                {
                    returnDocument: "after",
                    projection: { _id: 0 },
                },
            );
            return board ?? null;
        } catch (error) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async deleteBoard({ boardId, workspaceId, createdBy }: DeleteBoard): Promise<boolean> {
        try {
            const result = await this.collection.findOneAndDelete({ boardId, workspaceId, createdBy });
            return !!result;
        } catch (error) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }
}

export const boardRepository = new BoardRepository();

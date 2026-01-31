import type { BoardList, CreateBoardList, RenameBoardList } from "../schemas/boardList.ts";
import {v4 as uuid} from "uuid";
import { InternalServerErrorException } from "../utils/exceptions/server.ts";
import { workSpaceRepository } from "../repositories/workspace.ts";
import { BadRequestException, NotFoundException } from "../utils/exceptions/client.ts";
import { boardListRepository } from "../repositories/boardList.ts";

class BoardListServices {
    async createBoardList({title, boardId, workspaceId, createdBy}: CreateBoardList): Promise<BoardList> {
        try {
            const workspace = await workSpaceRepository.getWorkSpace(workspaceId);
            if(!workspace){
                throw new NotFoundException("Workspace not found");
            }
            if(!workspace.members.includes(createdBy)){
                throw new NotFoundException("You are not a member of this workspace");
            }
            const newBoardList: BoardList = {
                title,
                boardId,
                workspaceId,
                boardListId: `bl-${uuid()}`,
                createdAt: new Date().toISOString(),
                createdBy
            }
            await boardListRepository.createBoardList(newBoardList);
            return newBoardList;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    async getBoardLists(workspaceId: string, boardId: string): Promise<BoardList[]> {
        try {
            if(!workspaceId || !boardId){
                throw new BadRequestException("Missing required fields");
            }
            const boardLists = await boardListRepository.getBoardLists(workspaceId, boardId);
            return boardLists;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    async deleteBoardList(boardListId: string, workspaceId: string, boardId: string, actor: string): Promise<boolean> {
        try {
            if(!workspaceId || !boardId || !boardListId){
                throw new BadRequestException("Missing required fields");
            }
            const workspace = await workSpaceRepository.getWorkSpace(workspaceId);
            if(!workspace){
                throw new NotFoundException("Workspace not found");
            }
            if(!workspace.members.includes(actor)){
                throw new NotFoundException("You are not a member of this workspace");
            }
            const deleted = await boardListRepository.deleteBoardList(boardListId, workspaceId, boardId);
            return deleted;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    async renameBoardList({ boardListId, workspaceId, boardId, title, actor }: RenameBoardList & {actor: string}): Promise<BoardList | null>{
        try {
            if(!workspaceId || !boardId || !boardListId){
                throw new BadRequestException("Missing required fields");
            }
            const workspace = await workSpaceRepository.getWorkSpace(workspaceId);
            if(!workspace){
                throw new NotFoundException("Workspace not found");
            }
            if(!workspace.members.includes(actor)){
                throw new NotFoundException("You are not a member of this workspace");
            }
            const boardList = await boardListRepository.renameBoardList({ boardListId, workspaceId, boardId, title });
            return boardList;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }
}

export const boardListServices = new BoardListServices();
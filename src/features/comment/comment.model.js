import { ObjectId } from "mongodb";

export default class CommentModel{
    constructor(postId, userId, content){
        this.postId = new ObjectId(postId);
        this.userId = new ObjectId(userId);
        this.content = content;
    }
}
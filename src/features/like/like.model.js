import { ObjectId } from "mongodb";

export default class LikeModel{
    constructor(userId,likeable,type){
        this.userId = new ObjectId(userId);
        this.likeable = new ObjectId(likeable);
        this.type = type;
    }
}
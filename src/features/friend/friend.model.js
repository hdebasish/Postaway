import { ObjectId } from "mongodb";

export class FriendModel{
    constructor(from_user, to_user, isFriend ){
        this.from_user = new ObjectId(from_user);
        this.to_user = new ObjectId(to_user) ;
        this.isFriend=isFriend;
    }
}
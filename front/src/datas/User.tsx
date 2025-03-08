export class User {
    id: number;
    uid: number;
    username: string;
    email: string;
    password: string;
  
    constructor(id: number, uid: number, username: string, email: string, password: string) {
        this.id = id;
        this.uid = uid;
        this.username = username;
        this.email = email;
        this.password = password;
    }
}
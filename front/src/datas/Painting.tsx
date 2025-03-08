export class Painting {
    id: number;
    author: string;
    name: string;
    imageUrl: string;
    isSigned: boolean;
  
    constructor(id: number, author: string, name: string, imageUrl: string, isSigned: boolean) {
        this.id = id;
        this.author = author;
        this.name = name;
        this.imageUrl = imageUrl;
        this.isSigned = isSigned;
    }
}
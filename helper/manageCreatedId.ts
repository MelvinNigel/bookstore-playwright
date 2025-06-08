import genreJson from '../json/genreHelper.json'
import allSavedGenre from '../json/allSavedGenreBook.json'
import fs from 'fs';

export class ManageCreatedId {
    // private readonly page: Page
    // constructor(page: Page){
    //     this.page = page
    // }

    async saveCreatedId(id: string){
        const genreJsonFile = './json/genreHelper.json'
        genreJson.created_id = id
        fs.writeFileSync(genreJsonFile, JSON.stringify(genreJson))
    }

    async getLastCreatedId(){
        const lastCreatedId = genreJson.created_id
        return lastCreatedId
    }

    async saveAllGenreBook(response: any){
        const allSavedGenreFile = './json/allSavedGenreBook.json'
        allSavedGenre.all_data = response
        fs.writeFileSync(allSavedGenreFile, JSON.stringify(allSavedGenre))
    }

    async getLastSavedGenreId(){
        const lastSavedGenreId = allSavedGenre.all_data.pop()?.id
        const allSavedGenreFile = './json/allSavedGenreBook.json'
        fs.writeFileSync(allSavedGenreFile, JSON.stringify(allSavedGenre))
        return lastSavedGenreId
    }
    
    async pushNewCreatedData(response: any){
        const allSavedGenreFile = './json/allSavedGenreBook.json'
        allSavedGenre.all_data.push(response)
        fs.writeFileSync(allSavedGenreFile, JSON.stringify(allSavedGenre))
    }
}
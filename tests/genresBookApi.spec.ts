import {expect, test} from '@playwright/test'
import { v4 as uuidv4 } from 'uuid'
import {faker} from '@faker-js/faker'

const baseUrl = "https://ohmybookapi.azurewebsites.net"
test('[positive] - Get all genres of existing book', async({request}) => {
    const response = await request.get(`${baseUrl}/genres`)

    const responseBody = await response.json()
    console.log(responseBody)
    let totalGenres = 0
    for (const genre of responseBody){
        if(genre.id){totalGenres += 1}
    }
    let dataTypeResponse = typeof(responseBody[0])
    expect(response.status()).toEqual(200)
    expect(dataTypeResponse).toEqual('object')
    expect(responseBody[0]).toHaveProperty('id')
    expect(responseBody[0]).toHaveProperty('name')
    expect(responseBody[0]).toHaveProperty('description')
    expect(responseBody[0].id).toEqual(expect.any(String))
    expect(responseBody[0].name).toEqual(expect.any(String))
    expect(responseBody[0].description).toEqual(expect.any(String))
    expect(totalGenres).toBeGreaterThan(5)
})

test('[positive] - Find a registered genre', async({request}) => {
    const genre_id_book = '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d'
    const response = await request.get(`${baseUrl}/genres/${genre_id_book}`)
    const responseBody = await response.json()
    console.log(responseBody)
    expect(response.status()).toEqual(200)
    expect(responseBody).toHaveProperty('id')
    expect(responseBody).toHaveProperty('name')
    expect(responseBody).toHaveProperty('description')
    expect(Object.keys(responseBody).length).toEqual(3)
    expect(responseBody.id).toEqual(expect.any(String))
    expect(responseBody.name).toEqual(expect.any(String))
    expect(responseBody.description).toEqual(expect.any(String))
    expect(responseBody.id).toEqual(genre_id_book)
    expect(responseBody.name).toEqual('Thriller')
    expect(responseBody.description).toEqual('Intense and gripping')
})

test('[negative] - Find an unregistered genre', async({request}) => {
    const randomId = uuidv4()
    const genre_id_book = randomId
    const response = await request.get(`${baseUrl}/genres/${genre_id_book}`)
    const responseBody = await response.json()
    expect(response.status()).toEqual(404)
    expect(responseBody).toHaveProperty('type')
    expect(responseBody).toHaveProperty('title')
    expect(responseBody).toHaveProperty('status')
    expect(responseBody).toHaveProperty('traceId')
    expect(Object.keys(responseBody).length).toEqual(4)
    expect(responseBody.title).toEqual('Not Found')
    expect(responseBody.status).toEqual(404)
})

test('[positive] - Create a new genre', async({request}) => {
    const randomGenre = faker.book.genre()
    const randomDescription = faker.word.words(5)

    const response = await request.post(`${baseUrl}/genres`,{
        data:{
            "name": `${randomGenre}`,
	        "description": `${randomDescription}`
        }
    })
    const responseBody = await response.json()
    console.log(responseBody)
    expect(response.status()).toEqual(201)
    expect(responseBody).toHaveProperty('id')
    expect(responseBody).toHaveProperty('name')
    expect(responseBody).toHaveProperty('description')
    expect(Object.keys(responseBody).length).toEqual(3)
    expect(responseBody.id).toEqual(expect.any(String))
    expect(responseBody.name).toEqual(expect.any(String))
    expect(responseBody.description).toEqual(expect.any(String))
    expect(responseBody.name).toEqual(randomGenre)
    expect(responseBody.description).toEqual(randomDescription)

    //check if the data is successfully created
    const created_genre_id = responseBody.id
    const validationResp = await request.get(`${baseUrl}/genres/${created_genre_id}`)
    const validationBody = await validationResp.json()

    expect(validationResp.status()).toEqual(200)
    expect(validationBody.id).toEqual(created_genre_id)
})


test('[positive] - Delete specific genre', async({request}) => {
    const genre_id_book = '13aea895-9a81-4bd8-81d7-3230419b7eeb'
    //delete data
    const response = await request.delete(`${baseUrl}/genres/${genre_id_book}`)
    expect(response.status()).toEqual(204)

    //check if the data is deleted
    const validationResp = await request.get(`${baseUrl}/genres/${genre_id_book}`)
    const validationBody = await validationResp.json()

    expect(validationResp.status()).toEqual(404)
    expect(validationBody.title).toEqual('Not Found')
    expect(validationBody.status).toEqual(404)
})
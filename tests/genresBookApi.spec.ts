import {expect, test} from '@playwright/test'


const baseUrl = "https://ohmybookapi.azurewebsites.net"

test('Get all genres of existing book', async({request}) => {
    const response = await request.get(`${baseUrl}/genres`)

    const responseBody = await response.json()
    console.log(responseBody)
    let dataTypeResponse = typeof(responseBody[0])
    expect(response.status()).toEqual(200)
    expect(dataTypeResponse).toEqual('object')
    expect(responseBody[0]).toHaveProperty('id')
    expect(responseBody[0]).toHaveProperty('name')
    expect(responseBody[0]).toHaveProperty('description')
    expect(responseBody[0].id).toBe(String)
    expect(responseBody[0].name).toBe(String)
    expect(responseBody[0].description).toBe(String)
})
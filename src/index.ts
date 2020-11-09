import { Request } from "express";
import { Response } from "express";
import express from "express";

import { client } from "./storage";
import { Box } from "./storage";
import { Item } from "./storage";
import { NotFoundError } from "./storage";

const app = express();
const port = 8080;

app.use(express.json());

app.post( "/storage/box", async ( request: Request, response: Response ) => {
    const json = request.body;
    if (!json) return response.status(400).send("Invalid Request");
    if (!json.location) return response.status(400).send("Invalid Request");

    const box = await Box.register({
        location: json.location,
        items: [],
    });
    response.json(box);
} );

app.patch("/storage/box", async ( request: Request, response: Response ) => {
    const json = request.body;
    if (!json.box) return response.status(400).send("Invalid Request");
    if (!json.items) return response.status(400).send("Invalid Request");
    try {
        const items: Item.RegisteredItem[] = await Promise.all(json.items.map(Item.getItem));
        await Box.addItems(json.box, items);
        return response.status(200).json({});
    } catch(err) {
        switch (err.constructor) {
            case (NotFoundError):
                return response.status(400).send("Invalid Request");
            default:
                console.log(err);
                return response.status(500).send("Unknown Server Issue");
        }
    }
});

app.get("/storage/box", async ( request: Request, response: Response ) => {
    if (!request.query) return response.status(400).send("Invalid Request");
    if (!request.query.id) return response.status(400).send("Invalid Request");
    const id = request.query.id;
    if (typeof id !== "string") return response.status(400).send("Invalid Request");
    try {
        const box = await Box.get(id);
        return response.status(200).json(box);
    } catch(err) {
        switch (err.constructor) {
            case (NotFoundError):
                return response.status(400).send("Invalid Request");
            default:
                console.log(err);
                return response.status(500).send("Unknown Server Issue");
        }
    }
})

app.get("/storage/item", async ( request: Request, response: Response ) => {
    if (!request.query) return response.status(400).send("Invalid Request");
    if (!request.query.id) return response.status(400).send("Invalid Request");
    const id = request.query.id;
    if (typeof id !== "string") return response.status(400).send("Invalid Request");
    try {
        const item = await Item.get(id);
        return response.status(200).json(item);   
    } catch(err) {
        switch (err.constructor) {
            case (NotFoundError):
                return response.status(400).send("Invalid Request");
            default:
                console.log(err);
                return response.status(500).send("Unknown Server Issue");
        }
    }
})

// start the Express server
client.connect().then(() => {
    console.log("Mongo Connected at http://localhost:27017");
    app.listen( port, () => {
        console.log( `Server started at http://localhost:${ port }` );
    });
});

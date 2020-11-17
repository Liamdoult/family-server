import { Request } from "express";
import { Response } from "express";
import express from "express";
import cors from "cors";

import { client } from "./database";
import { Box } from "./storage";
import { Item } from "./storage";
import { Shopping } from "./shopping";
import { NotFoundError } from "./storage";

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

app.post("/storage/box", async ( request: Request, response: Response ) => {
    console.log("POST /storage/box");
    const json = request.body;
    if (!json) return response.status(400).send("Invalid Request");
    if (!json.label) return response.status(400).send("Invalid Request");
    if (!json.location) return response.status(400).send("Invalid Request");

    try {
        const box = await Box.register({
            label: json.label,
            location: json.location,
            items: [],
        });
        if (json.items) {
            const items: Item.RegisteredItem[] = await Promise.all(json.items.map(Item.getItem));
            await Box.addItems(box, json.items);
            box.items = items;
        }
        response.json(box);
    } catch(err) {
        switch (err.constructor) {
            case (NotFoundError):
                return response.status(400).send("Invalid Request");
            default:
                console.log(err);
                return response.status(500).send("Unknown Server Issue");
        }
    }
} );

app.patch("/storage/box", async ( request: Request, response: Response ) => {
    console.log("PATCH /storage/box");
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
    console.log("GET /storage/box");
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
    console.log("GET /storage/item");
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

app.get("/storage/search", async ( request: Request, response: Response ) => {
    console.log("GET /storage/search");
    if (!request.query) return response.status(400).send("Invalid Request");
    if (!request.query.term) return response.status(400).send("Invalid Request");
    const items = await Item.search(request.query.term as string);
    const boxes = await Box.search(request.query.term as string);
    return response.status(200).json({
        boxes,
        items
    })
})


app.get("/shopping", async ( request: Request, response: Response ) => {
    console.log("GET /shopping");
    return response.status(200).json({ items: Shopping.get() });
})

app.post("/shopping", async ( request: Request, response: Response ) => {
    console.log("POST /shopping");
    const json = request.body;
    if (!json.items) return response.status(400).send("Invalid Request");
    await Shopping.add(json.items);
    return response.status(200).json({});
})

app.patch("/shopping", async ( request: Request, response: Response ) => {
    console.log("PATCH /shopping");
    if (!request.query) return response.status(400).send("Invalid Request");
    if (!request.query.id) return response.status(400).send("Invalid Request");
    if (request.query.purchased) await Shopping.purchased(request.query.id as string);
    return response.status(200).json({});
})

app.delete("/shopping", async ( request: Request, response: Response ) => {
    console.log("DELETE /shopping");
    if (!request.query) return response.status(400).send("Invalid Request");
    if (!request.query.id) return response.status(400).send("Invalid Request");
    await Shopping.deleted(request.query.id as string);
    return response.status(200).json({});
})

// start the Express server
// Mongo needs to be started before express to ensure mongo is always running
// when requests are made to the server.
client.connect().then(() => {
    console.log("Mongo Connected at http://localhost:27017");
    app.listen( port, () => {
        console.log( `Server started at http://localhost:${ port }` );
    });
});

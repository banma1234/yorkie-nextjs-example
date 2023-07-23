import type { ENVtypes } from "./types";

import * as yorkie from "yorkie-js-sdk";

const ENV: ENVtypes = {
    url: process.env.YORKIE_API_ADDR,
    apiKey: process.env.YORKIE_API_KEY
};

export default function createClient() {
    // Yorkie Client declaration
    const client = new yorkie.Client(ENV.url ? ENV.url : "", {
        apiKey: ENV.apiKey,
    });

    return client;
}
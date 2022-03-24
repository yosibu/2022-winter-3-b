import { serve } from "https://deno.land/std@0.127.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.127.0/http/file_server.ts";
import { format } from "https://deno.land/std@0.127.0/datetime/mod.ts";
import { Todo } from "./todo.ts";
// import { UUID } from "https://code4sabae.github.io/js/UUID.js";
// import { push } from "./push_cmd.js";

// ToDo の API は Todo クラスにまとめてある
const todo = new Todo();

console.log("Listening on http://localhost:8000");
serve( async(req) => {
    const url = new URL(req.url);
    const pathname = url.pathname;

    console.log("Request:", req.method, pathname);

    // /api/ で始まる場合、API サーバっぽく処理して返す
    if (pathname.startsWith("/api/")) {
        switch (pathname) {
            case "/api/time":
                return apiTime(req);
            case "/api/asmd": // addition, subtraction, multiplication, division の頭文字
                return apiFourArithmeticOperations(req);
            case "/api/reverse":
                return apiReverse(req);
            case "/api/todo/list":
                return todo.apiList(req);
            case "/api/todo/add":
                return todo.apiAdd(req);
            case "/api/todo/delete":
                return todo.apiDelete(req);
            case "/api/setList":
                return setList(req)
            case "/api/getToDoList":
                return getList(req)
            // case "/api/subscribe":
            //     try {
            //         const subscription = JSON.stringify(req);
            //         const uuid = UUID.generate();
            //         await Deno.writeTextFile("data/subscription/" + uuid + ".json", subscription);
            //         console.log(uuid);
            //         return { uuid };
            //     } catch (e) {
            //         console.log(e);
            //     }
            // case "/api/unsubscribe":
            //     try {
            //         console.log(req);
            //         const uuid = req.uuid;
            //         console.log(uuid);
            //         await Deno.remove("data/subscription/" + uuid + ".json");
            //         return { uuid };
            //     } catch (e) {
            //         console.log(e);
            //     }
            // case "/api/push":
            //     try {
            //         const uuid = req.uuid;
            //         const data = req.data;
            //         return push(uuid, data);
            //         return { uuid };
            //     } catch (e) {
            //         console.log(e);
            //     }
        }
    }

    // pathname に対応する static フォルダのファイルを返す（いわゆるファイルサーバ機能）
    // / → static/index.html
    // /hoge → static/hoge/index.html
    // /fuga.html → static/fuga.html
    // /img/piyo.jpg → static/img/piyo.jpg
    return serveDir(req, {
        fsRoot: "static",
        urlRoot: "",
        showDirListing: true,
        enableCors: true
    });
});

let list: string [] = [];

const setList = (req: Request) => { //送られたデータをそのまま返す
    const params = parseSearchParams(new URL(req.url))
    const name = params.x.toString()
    const i = list.length
    list[i] = name
    return createJsonResponse({list})
}

const getList = (req: Request) => {
    return createJsonResponse({list})
}





// 従来の function を使った関数宣言
// 現在の日時を返す API
function apiTime(req: Request) {
    return new Response(format(new Date(), "yyyy-MM-dd HH:mm:ss"));
}

// アロー関数を使った関数宣言
// クエリパラメータの x と y の四則演算の結果を JSON で返す API
const apiFourArithmeticOperations = (req: Request) => {
    const params = parseSearchParams(new URL(req.url));
    const x = params.x;
    const y = params.y;

    let addition = 0;
    let subtraction = 0;
    let multiplication = 0;
    let division = 0;
    if (typeof x === "number" && typeof y === "number") {
        addition = x + y;
        subtraction = x - y;
        multiplication = x * y;
        division = x / y;
    }
    return createJsonResponse({ x, y, addition, subtraction, multiplication, division });
}

// URL のクエリパラメータをパースする
const parseSearchParams = (url: URL) => {
    const params: Record<string, string | number | boolean> = {};
    for (const p of url.searchParams) {
        const n = p[0], v = p[1];
        if (v === "")
            params[n] = true;
        else if (v === "true")
            params[n] = true;
        else if (v === "false")
            params[n] = false;
        else if (!isNaN(Number(v)))
            params[n] = +v;
        else
            params[n] = v;
    }
    return params;
};

// JSON のレスポンスを生成する
const createJsonResponse = (obj: any) => new Response(JSON.stringify(obj), {
    headers: {
        "content-type": "application/json; charset=utf-8"
    }
});

// クライアントから送られてきた JSON の message の文字列を反転して返す API
// curl -X POST -d '{ "message": "hello" }' http://localhost:8000/api/reverse
// → {"message":"olleh"}
const apiReverse = async (req: Request) => {
    const json = (await req.json()) as ApiReversePayload;
    const message = json.message;
    const reversedMessage = message.split("").reverse().join("");
    return createJsonResponse({ message: reversedMessage });
};

type ApiReversePayload = {
    message: string;
};

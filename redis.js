const redis = require("ioredis")
const readline = require("readline")
const s = "rediss://default:qdlcaw35344ckavb@db-redis-nyc1-34717-do-user-3860233-0.db.ondigitalocean.com:25061"
const client = new redis(s)
const pub = new redis(s)

client.on("error", (err) => {
    console.log("Error", err)
})

client.get("test", (err, val) => {
    console.log(`got ${val.toString()}`)
})

client.subscribe("testP")

client.on("message", (chan, msg) => {
    console.log(`Got message: ${msg} from Channel: ${chan}`)
})

const searchStuff = (input) => {
    if (!input) return ""
    const res = index.search(input, {
        fields: {
            title: { boost: 2 },
            body: { boost: 1 }
        }
    })
    if (res[0]) {
        // console.log(index.documentStore.getDoc(res[0].ref))
        return (index.documentStore.getDoc(res[0].ref))
    }
}

let queryString = ""

console.clear()
console.log("Start typing to search...")
process.stdout.write("> ")

readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)
process.stdin.on("keypress", (str, key) => {
    if (key.ctrl && key.name === "c") { // Be able to exit
        process.exit()
    } else {
        // console.log(`You pressed the "${str}" key`)
        // console.log(key)
        console.clear()
        console.log("Start typing to search...")
        process.stdout.cursorTo(0)
        process.stdout.clearLine()
        process.stdout.write("> ")
        if (key.name === "return") {
            queryString = ""
        } else if (key.name === "backspace") {
            queryString = queryString.substring(0, queryString.length - 1)
        } else {
            // console.log(key)
            queryString += key.sequence
            // process.stdout.write(`\n${JSON.stringify(searchStuff(queryString))}`)
            // console.log(searchStuff(queryString))
        }
        process.stdout.write(queryString)
        process.stdout.cursorTo(queryString.length + 2)
        const ress = searchStuff(queryString)
        if (ress) {
            console.log()
            console.log(`${JSON.stringify(ress)}`)
        }
    }
})

// setTimeout(() => {
//     setInterval(() => {
//         pub.publish("testP", "yay")
//     }, 1000)
// }, 1000)

const elasticlunr = require('elasticlunr')
const readline = require('readline')

const index = elasticlunr(function () {
    this.addField('title');
    this.addField('body');
    this.setRef('id');
})

index.saveDocument(true)

index.addDoc({
    "id": 1,
    "title": "Oracle released its latest database Oracle 12g",
    "body": "Yestaday Oracle has released its new database Oracle 12g, this would make more money for this company and lead to a nice profit report of annual year."
})
index.addDoc({
    "id": 2,
    "title": "Oracle released its profit report of 2015",
    "body": "As expected, Oracle released its profit report of 2015, during the good sales of database and hardware, Oracle's profit of 2015 reached 12.5 Billion."
})

// save indexes to file:
// JSON.stringify(index)
// load indexes from file:
// index = elasticlunr.Index.load(JSON.parse(fileContents))

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
    } else {
        return false
    }
}
// https://github.com/weixsong/elasticlunr.js/issues/82#issuecomment-383822938

let queryString = ""

console.clear()
console.log("Start typing to search...")
process.stdout.write("> ")

readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)
process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') { // Be able to exit
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

// console.log(searchStuff("oracle released 12g"))

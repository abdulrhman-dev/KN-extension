function scrapPage() {
    const content = document.body.querySelectorAll("._1o51yl6")

    let cards = []

    content.forEach(card => {
        const dataSlug = card.getAttribute('data-slug')

        let reg = /quiz|test/g

        let heading = card.querySelector("._dwmetq");
        if (dataSlug.match(reg) === null) {
            const cardObject = {
                title: heading.textContent,
                link: heading.href,
                stats: {
                    practice: 0,
                    video: 0,
                    article: 0
                }
            }
            let lists = card.querySelectorAll("._13ise4e")

            let mainContent = lists[0].querySelectorAll("li")

            if (lists.length > 1) {
                let practice = lists[1].querySelectorAll("li")
                cardObject.stats.practice = practice.length
            }


            mainContent.forEach(item => {
                let type = item.querySelector("._e296pg").getAttribute("aria-label")

                if (type === "Article") {
                    cardObject.stats.article += 1;
                } else if (type === "Video") {
                    cardObject.stats.video += 1;
                }
            })

            cards.push(cardObject)
        }
    })


    return cards
}

function turnToNotion(cards) {
    let todoList = []

    cards.forEach(card => {
        let stats = [
            `🖥️: **${card.stats.video}**`,
            `📖: **${card.stats.article}**`,
            `📝: **${card.stats.practice}**`
        ]

        todoList.push(`- [ ] [**${card.title}**](${card.link}) ${stats.join(" ")}`)
    })

    return todoList.join("\n")
}

function copyToClipboard(text) {
    console.log(text)
    let elem = document.createElement("textarea");
    document.body.appendChild(elem);

    elem.value = text;
    elem.select();

    navigator.clipboard.writeText(elem.value);

    document.body.removeChild(elem);

}

function activeScrap() {
    let cards = scrapPage()
    copyToClipboard(turnToNotion(cards))

}



function createKhanButton(text) {
    let button = document.createElement('button')


    let span = document.createElement("span")
    span.textContent = text
    span.classList.add('_1alfwn7n');

    button.appendChild(span)


    button.id = "button-kn-impor"

    return button
}


function setupExt() {
    var interval = setInterval(function () {
        if (document.querySelector("._1o51yl6") != null) {
            clearInterval(interval);
            let button = createKhanButton("Copy")
            document.querySelector("._1wv6lz9").appendChild(button)
            button.addEventListener("click", () => {
                activeScrap()
            })
        }
    }, 100);
}


let oldUrl;

setInterval(() => {
    let url = window.location.href

    if (oldUrl !== url) {
        const pattern = new URLPattern({ pathname: '/:course/:id/:section' });
        let match = pattern.test(url)

        if (match) {
            let groupNames = pattern.exec(url).pathname.groups


            if (checkIsPlace(groupNames)) {
                setupExt()
            }
        }


        oldUrl = url
    }
}, 1000)



function checkIsPlace(groupNames) {
    let { course } = groupNames
    let courses = ["math", "humanities", "college-careers-more", "computing", "science", "economics-finance-domain"]

    let match = courses.find(avaliableCourse => course === avaliableCourse)

    if (match === undefined) {
        return false
    } else {
        return true
    }
}


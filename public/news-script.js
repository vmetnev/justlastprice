getTags()

const searchButton = document.querySelector(".search-button");
const searchText = document.querySelector(".search-text");

const addTag = document.querySelector('.output-tag-add')
const deleteTag = document.querySelector('.output-tag-delete')
const tagHolder = document.querySelector('.output-tag-holder')

addTag.addEventListener('click', addTagHandler)
deleteTag.addEventListener('click', deleteTagHandler)

async function addTagHandler() {
  console.log('add tag')
  let tagToAdd = prompt('Provide tag')
  let resp = await fetch(`http://127.0.0.1:3001/addTag`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({ tag: tagToAdd, })
  })
  resp = await resp.json()
  console.log(resp)

  if (resp === "saved") {
    let newTag = document.createElement('p')
    newTag.classList.add('tag')
    newTag.innerText = tagToAdd
    newTag.addEventListener('click', tagClickHandler)
    document.querySelector('.output-tag-holder').appendChild(newTag)

    document.querySelectorAll('.tag').forEach(tag => {
      if (tag.classList.contains('tag-active')) tag.classList.remove('tag-active')
    })

    newTag.classList.add('tag-active')

    searchForNews(tagToAdd)
  }

}

async function deleteTagHandler() {
  console.log('delete tag')
  let target = document.querySelector('.tag-active')
  target.remove()
  let resp = await fetch(`http://127.0.0.1:3001/deleteTag?tag=${target.innerText}`)
  resp = await resp.json()
  console.log(resp)
}


async function getTags() {
  let tags = await fetch(`http://127.0.0.1:3001/getTags`);
  tags = await tags.json();
  console.log(tags)
  tags.forEach(tag => {
    let tagEl = document.createElement('p')
    tagEl.classList.add('tag')
    tagEl.innerText = tag.tag
    tagEl.addEventListener('click', tagClickHandler)
    document.querySelector('.output-tag-holder').appendChild(tagEl)
  })
}

function tagClickHandler(evt) {
  console.log(evt.target.innerText)

  document.querySelectorAll('.tag').forEach(tag => {
    if (tag.classList.contains('tag-active')) tag.classList.remove('tag-active')
  })

  evt.target.classList.add('tag-active')
  searchForNews(evt.target.innerText)

}

searchButton.addEventListener("click", searchForNews);

async function searchForNews(inp) {
  console.log(searchText.value);
  console.log(typeof inp)
  if (inp && typeof inp != 'object') {
    searchText.value = inp
    console.log('input')
    console.log(inp)
  }
  if (searchText.value.trim() === "") {
    console.log("empty");
    return;
  }

  let news = await fetch(
    `http://127.0.0.1:3001/getNews?text=${searchText.value}`
  );
  news = await news.json();
  console.log(news);

  let toDelete = document.querySelectorAll(".story-holder");
  toDelete.forEach((item) => item.remove());

  news.forEach(async (story) => {
    let { title, providerPublishTime, link, publisher, uuid, relatedTickers } = story;
    let newsHolder = document.createElement("div");
    newsHolder.classList.add("story-holder");
    newsHolder.id = uuid
    let storyTitle = document.createElement("a");
    storyTitle.classList.add("story-title");
    storyTitle.innerText = title;
    storyTitle.href = link;
    storyTitle.target = "_blank";
    newsHolder.appendChild(storyTitle);
    let publisherText = document.createElement("p");
    publisherText.classList.add("story-publisher");
    publisherText.innerText = publisher
    newsHolder.appendChild(publisherText)
    let timeText = document.createElement("p")
    timeText.classList.add("story-time")
    timeText.value = new Date(providerPublishTime).valueOf()
    timeText.innerText = new Date(providerPublishTime).toUTCString()
    newsHolder.appendChild(timeText)
    document.querySelector(".output").appendChild(newsHolder)
    let saveButton = document.createElement('button')
    saveButton.innerText = "Save"
    saveButton.classList.add('story-save-button')
    newsHolder.appendChild(saveButton)
    saveButton.addEventListener('click', async () => {

      let response = await fetch(`http://127.0.0.1:3001/saveNews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(
          {
            title: title,
            providerPublishTime: providerPublishTime,
            link: link,
            publisher: publisher,
            uuid: uuid,
            relatedTickers: relatedTickers,
            unixDateAndTime: new Date(providerPublishTime),
            mainQuery: searchText.value
          }
        )
      });
      let result = await response.json();
      console.log(result)
    })
  });
}

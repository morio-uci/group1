addEventListener('DOMContentLoaded', async () => {
    const tagInputs = Array.from(document.getElementsByClassName('tag-input'))
    const promises = tagInputs.map(input => {
        input.addEventListener('input', async () => {
            await fillDataList(input)
            autoResizeInput(input)
        })

        input.addEventListener('change', async () => {
            await updateInput(input)
            autoResizeInput(input)
            await updatePopularTags('popular-tags')
            await updateUnusedTags('unused-tags')
        })

        input.addEventListener('focus', async () => {
            if (input.readonly) {
                input.readonly = false;
                await loadInput(input)
            }
            await fillDataList(input)
        })

        return loadInput(input)
    })
    await Promise.all(promises)
    await updatePopularTags('popular-tags')
    await updateUnusedTags('unused-tags')
})
const autoResizeInput = (input) => {
    const sizerId = input.id+'-input-sizer'
    const sizerText = input.value || input.placeholder
    let sizer = document.getElementById(sizerId)
    if (!sizer) {
        sizer = document.createElement('span')
        sizer.id = sizerId
        sizer.style.color = document.body.style.backgroundColor
        sizer.style.font = window.getComputedStyle(input).font
        sizer.style.fontSize = window.getComputedStyle(input).fontSize
        document.body.append(sizer)
    }
    sizer.innerHTML = ''
    sizer.appendChild(document.createTextNode(sizerText))
    sizer.style.display = 'inline'
    input.style.width = (sizer.offsetWidth+20).toString() + 'px'
    sizer.style.display = 'none'
}
const fillDataList = async input => {
    if(!fillDataList.hasOwnProperty('staticCallId')) {
        fillDataList.staticCallId = {}
    }

    if(!fillDataList.staticCallId.hasOwnProperty(input.id)){
        fillDataList.staticCallId[input.id] = 0
    }
    else {
        fillDataList.staticCallId[input.id]++
    }
    const myCallId = fillDataList.staticCallId[input.id]
    const datalist = document.getElementById(input.id + '-list')
    datalist.innerHTML = ''
    try {
        const result = await fetch('api/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                query:
                    `query Search($query: Search!) {
                        search(query: $query){
                            results
                        }
                     }`,
                variables: {
                    query: {query: input.value}
                }
            })

        })

        // only fill if we were the latest call
        if (myCallId === fillDataList.staticCallId[input.id]) {
            const results = (await result.json()).data.search.results
            datalist.innerHTML = ''

            let option
            results.forEach(tags => {
                option = document.createElement('option')
                option.appendChild(document.createTextNode(tags))
                datalist.appendChild(option)
            })
        }
    }
    catch (e){
        console.log(e.message)
        const datalist = document.getElementById(input.id + '-list')
        datalist.innerHTML = ''
    }

}

const updateInput = async input => {
    try {
        const result = await fetch('api/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                query:
                    `mutation UpdateTags($update: Update!) {
                              updateTags(update: $update){
                                id
                                tags
                              }
                          }`,
                variables: {
                    update: {
                        id: input.id,
                        tags: input.value
                    }
                }

            })
        })
        input.value = (await result.json()).data.updateTags.tags
    }
    catch (e){
        console.log(e.message)
        input.value = 'failed to load'
        input.readonly = true
        input.style.color = 'red'
    }
}

const loadInput = async input => {
    input.disable = true
    input.value = "Loading..."
    try {
        const result = await fetch('api/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                query:
                    `query GetTags($id: ID!) {
                              getTags(id: $id){
                                id
                                tags
                              }
                          }`,
                variables: {
                    id: input.id
                }

            })
        })
        input.value = (await result.json()).data.getTags.tags
        autoResizeInput(input)
        input.disabled = false
    }
    catch (e){
        console.log(e.message)
        input.value = 'failed to load'
        input.disabled = false
        input.readonly = true
        input.style.color = 'red'
    }
}

const updatePopularTags = async (id) => {
    const tagsDiv = document.getElementById(id)
    try {
        const result = await fetch('api/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                query:
                    `query PopularTags {
                        popularTags{
                          total
                          tags {
                            tag
                            count
                          }
                        }
                    }`

            })
        })
        const data = (await result.json()).data.popularTags
        tagsDiv.innerHTML = ''
        let tagEl
        const maxCount = data.total > 0 ? data.tags[0].count : 0


        data.tags.forEach(tagData => {
            tagEl = document.createElement('span')
            tagEl.classList.add('popular-tag')
            // red to green scale from highest count to lowest
            const hue = maxCount === 1 ? 0 : (120 - 120/(maxCount-1)*(tagData.count-1))
            tagEl.style.backgroundColor = `hsl(${hue}, 75%, 50%)`
            const fontSize = maxCount === 1 ? 1 : (1.25/(maxCount-1)*(tagData.count-1) + 0.75)
            console.log(fontSize)
            tagEl.style.fontSize = `${fontSize.toFixed(2)}rem`
            const tagText = document.createTextNode(tagData.tag)
            tagEl.appendChild(tagText)
            tagsDiv.appendChild(tagEl)
            tagsDiv.innerHTML += ' '
        })
    }
    catch (e){
        console.log(e.message)
        const errorSpan = document.createElement('span')
        errorSpan.classList.add('error-msg')
        const errorText = document.createTextNode('error loading tags')
        errorSpan.appendChild(errorText)
        tagsDiv.appendChild(errorSpan)
    }

}

const updateUnusedTags = async (id) => {
    const tagsDiv = document.getElementById(id)
    try {
        const result = await fetch('api/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                query:
                    `query UnusedTags {
                          unusedTags{                              
                            tags
                          }
                      }`

            })
        })
        const data = (await result.json()).data.unusedTags
        tagsDiv.innerHTML = ''
        let tagEl

        data.tags.forEach(tag => {
            tagEl = document.createElement('span')
            tagEl.classList.add('unused-tag')
            const tagText = document.createTextNode(tag)
            tagEl.appendChild(tagText)
            tagsDiv.appendChild(tagEl)
            tagsDiv.innerHTML += ' '
        })
    } catch (e) {
        console.log(e.message)
        const errorSpan = document.createElement('span')
        errorSpan.classList.add('error-msg')
        const errorText = document.createTextNode('error loading tags')
        errorSpan.appendChild(errorText)
        tagsDiv.appendChild(errorSpan)
    }
}
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

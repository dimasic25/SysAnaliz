// @ts-ignore
document.addEventListener('DOMContentLoaded', () => {
    let select = document.querySelector('.matrix-size');

    select.addEventListener('change', (ev) => {
        let selectValue: string = (ev.target as HTMLSelectElement).value
        let matrixSize: number = parseInt(selectValue);
        let matrix = document.querySelector('.matrix');
        clearElement(matrix)

        for (let i = 0; i < matrixSize; i++) {
            let tr = document.createElement("tr")
            for (let j = 0; j < matrixSize; j++) {
                let td = document.createElement("td")
                let input = document.createElement('input')
                input.setAttribute("type", "number")
                input.setAttribute("min", "0")
                input.setAttribute("max", "1")
                input.setAttribute("value", "0")
                input.required = true
                td.appendChild(input)
                tr.appendChild(td)
            }

            matrix.appendChild(tr)
        }
    })

    let button = document.querySelector('.btn')
    // @ts-ignore
    let reachableMap = new Map()
    // @ts-ignore
    let counterreachableMap = new Map()

    button.addEventListener('click', (ev) => {

        let selectElement = document.querySelector('.matrix-size') as HTMLSelectElement;
        let matrixSize = selectElement.value

        let adjacencyMatrix = getAdjacencyMatrix(matrixSize)

        let mainMap = getMap(adjacencyMatrix, matrixSize)

        let newAdjacencyMatrix = getNewAdjacencyMatrix(adjacencyMatrix, matrixSize, mainMap)
        let rightIncidentMatrix = getRightIncidentMatrix(newAdjacencyMatrix, mainMap.size)

        console.log(newAdjacencyMatrix)

        showNewSystem(mainMap)
        showRightIncidentMatrix(rightIncidentMatrix, mainMap.size)

        console.log(reachableMap)
        console.log(counterreachableMap)
        console.log(mainMap)
    })

    function getNewAdjacencyMatrix(adjacencyMatrix, matrixSize, mainMap) {
        let newAdjacencyMatrix = getFilledMatrix(mainMap.size, '0')

        for (let key = 0; key < mainMap.size; key++) {
            // @ts-ignore
            let set = new Set(mainMap.get(key + 1))
            set.forEach(function (value) {

                for (let column = 0; column < matrixSize; column++) {
                    if (adjacencyMatrix[value - 1][column] === '1' && !set.has(column + 1)) {
                        let newColumn = findSubSystem(mainMap, column + 1)
                        newAdjacencyMatrix[key][newColumn] = '1'
                    }
                }
            })
        }

        return newAdjacencyMatrix
    }

    function findSubSystem(mainMap, el) {
        let newColumn = -1
        mainMap.forEach(function (mas, key) {
            // @ts-ignore
            let set = new Set(mas)

            if (set.has(el)) {
                newColumn = key - 1
                return
            }
        })
        return newColumn;
    }

    function showNewSystem(mainMap) {
        let newSystemWrapper = document.querySelector('.new-system-wrapper')
        clearElement(newSystemWrapper)

        let newNumbersHeader = document.createElement('h2')
        newNumbersHeader.textContent = "Подсистемы"
        newSystemWrapper.appendChild(newNumbersHeader)

        mainMap.forEach((value, key) => {
            let row = document.createElement('div')
            row.innerHTML = `<span>Подсистема ${key}</span>`
            newSystemWrapper.appendChild(row)

            let rowMap = document.createElement('div')
            rowMap.innerHTML = '<span>Вершины ('
            value.forEach((val) => {
                rowMap.innerHTML += `${val} `
            })
            rowMap.innerHTML += ')</span>'
            newSystemWrapper.appendChild(rowMap)
        })

    }

    function getMap(adjacencyMatrix, matrixSize) {
        fillCounterreachableMap(matrixSize)
        // @ts-ignore
        let mainMap = new Map()
        // @ts-ignore
        let vertices = new Set()

        for (let i = 0; i < matrixSize; i++) {
            fillSubgraph(adjacencyMatrix, matrixSize, i);
        }

        let number = 1;
        for (let key = 0; key < matrixSize; key++) {
            // @ts-ignore
            let subgraph = Array.from(reachableMap.get(key + 1)).filter(x => counterreachableMap.get(key + 1).has(x))

            if (subgraph.filter(x => !vertices.has(x)).length === 0) {
                continue;
            }

            mainMap.set(number++, subgraph.filter(x => !vertices.has(x)))

            subgraph.forEach(function (value) {
                vertices.add(value)
            })
        }

        return mainMap
    }

    function fillSubgraph(adjacencyMatrix, matrixSize, row) {
        // @ts-ignore
        let reachableSet = new Set()
        reachableSet.add(row + 1)

        for (let column = 0 ; column < matrixSize; column++) {
            if (adjacencyMatrix[row][column] === '1') {
                reachableSet.add(column + 1)
                // console.log("Row: " + (row + 1) + " Column: " + (column + 1))
                counterreachableMap.get(column + 1).add(row + 1)
            }
        }

        // @ts-ignore
        let tempSet = new Set()

        while (reachableSet.size !== tempSet.size) {
            reachableSet.forEach(function (value) {
                tempSet.add(value)
            })

            tempSet.forEach(function (value) {
               for (let column = 0; column < matrixSize; column++) {
                   if (adjacencyMatrix[value - 1][column] === '1') {
                       reachableSet.add(column + 1)
                       counterreachableMap.get(column + 1).add(row + 1)
                   }
               }
            })
        }

        reachableMap.set(row + 1, reachableSet);
    }

    function fillCounterreachableMap(matrixSize) {
        for (let i = 0; i < matrixSize; i++) {
            // @ts-ignore
            let counterreachableSet = new Set()
            counterreachableSet.add(i + 1)
            counterreachableMap.set(i + 1, counterreachableSet)
        }
    }

    function getFilledMatrix(matrixSize, value) {
        let arr = []

        for (let i = 0; i < matrixSize; i++) {
            let subArr = []
            for (let j = 0; j < matrixSize; j++) {
                subArr.push(value)
            }
            arr.push(subArr)
        }

        return arr;
    }

    function clearElement(element) {
        element.innerHTML = ""
    }

    function getAdjacencyMatrix(matrixSize) {
        let matrix = document.querySelector('.matrix')
        let arr = getFilledMatrix(matrixSize, '0')

        let rows = matrix.getElementsByTagName('tr')

        for (let i = 0; i < rows.length; i++) {
            let row = rows.item(i)
            let inputs = row.getElementsByTagName('input')
            for (let j = 0; j < inputs.length; j++) {
                if (inputs.item(j).value !== '') {
                    arr[i][j] = inputs.item(j).value
                }
            }
        }

        return arr
    }

    // получить множество правых инциденций по матрице смежности
    function getRightIncidentMatrix(adjacencyMatrix, matrixSize) {
        let arr = getFilledMatrix(matrixSize, null)

        for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {
                let val
                if (adjacencyMatrix[i][j] !== '0') {
                    let index = j
                    val = ++index
                } else {
                    val = '0'
                }
                arr[i][j] = val;
            }
        }

        return arr
    }

    function showRightIncidentMatrix(matrix, matrixSize) {
        const rightIncidentMatrixWrapper = document.querySelector('.right-incident-matrix-wrapper')
        rightIncidentMatrixWrapper.innerHTML = ''

        let rightIncidentMatrixHeader = document.createElement('h2')
        rightIncidentMatrixHeader.textContent = "Множество правых инциденций"
        rightIncidentMatrixWrapper.appendChild(rightIncidentMatrixHeader)

        for (let i = 0; i < matrixSize; i++) {
            let row = document.createElement('div')
            row.className += "row"
            let rowVal = "";
            for (let j = 0; j < matrixSize; j++) {
                let val = matrix[i][j];
                rowVal += `${val !== null && val !== '0' ? val: ''} `
            }
            let index = i
            row.innerHTML = `<span>G<sup>+</sup>(${++index})</span> { ${rowVal}}`
            rightIncidentMatrixWrapper.appendChild(row)
        }
    }
})

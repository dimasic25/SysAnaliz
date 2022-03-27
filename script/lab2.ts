// @ts-ignore
document.addEventListener('DOMContentLoaded', () => {
    let select = document.querySelector('.matrix-size');

    select.addEventListener('change', (ev) => {
        let selectValue: string = (ev.target as HTMLSelectElement).value
        let matrixSize: number = parseInt(selectValue);
        let matrix = document.querySelector('.matrix');
        clearElement(matrix)

        let errorDiv = document.querySelector('.error')
        clearElement(errorDiv)

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

    button.addEventListener('click', (ev) => {
        let errorDiv = document.querySelector('.error')
        clearElement(errorDiv)

        let selectElement = document.querySelector('.matrix-size') as HTMLSelectElement;
        let matrixSize = selectElement.value

        let adjacencyMatrix = getAdjacencyMatrix(matrixSize)

        if (checkForContours(adjacencyMatrix, matrixSize)) {
            let errorDiv = document.querySelector('.error')
            errorDiv.innerHTML += "<span>" +
                "Граф имеет контуры" +
                " </span>"
        } else {
            let mapLevels = getMapLevels(adjacencyMatrix, matrixSize)
            let newAdjacencyMatrix = getNewAdjacencyMatrix(mapLevels, adjacencyMatrix, matrixSize)
            let rightIncidentMatrix = getRightIncidentMatrix(newAdjacencyMatrix, matrixSize)
            showNewNumbers(mapLevels)
            showRightIncidentMatrix(rightIncidentMatrix, matrixSize)
        }
    })

    function showNewNumbers(mapLevels) {
        let newNumbersWrapper = document.querySelector('.new-numbers-wrapper')
        clearElement(newNumbersWrapper)

        let newNumbersHeader = document.createElement('h2')
        newNumbersHeader.textContent = "Изменение нумерации"
        newNumbersWrapper.appendChild(newNumbersHeader)

        mapLevels.forEach((value, key) => {
            let row = document.createElement('div')
            row.innerHTML = `<span>Иерархический уровень ${key}</span>`
            newNumbersWrapper.appendChild(row)

            value.forEach((value, key) => {
              let rowMap = document.createElement('div')
                rowMap.innerHTML = `<span>Старый номер вершины - ${key}, новый номер - ${value}</span>`
                newNumbersWrapper.appendChild(rowMap)
            })
        })
    }

    // получаем новую матрицу смежности
    function getNewAdjacencyMatrix(mapLevels, adjacencyMatrix, matrixSize) {
        let arr = getFilledMatrix(matrixSize, '0')

        let newRow = 0
        let newColumn = 0

        for (let row = 0; row < matrixSize; row++) {
            for (let column = 0; column < matrixSize; column++) {
                if (adjacencyMatrix[row][column] === '1') {
                    console.log("Старая строка")
                    console.log(row)
                    console.log("Старый столбец")
                    console.log(column)
                    mapLevels.forEach((map) => {
                        if (map.get(row + 1) !== undefined) {
                            newRow = map.get(row + 1) - 1
                        }
                        if (map.get(column + 1) !== undefined) {
                            newColumn = map.get(column + 1) - 1
                        }
                    })
                    console.log("Новая строка")
                    console.log(newRow)
                    console.log("Новый столбец")
                    console.log(newColumn)
                    arr[newRow][newColumn] = '1'
                }
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

    // введение порядковой функции
    function getMapLevels(adjacencyMatrix, matrixSize) {

        // @ts-ignore
        let mapLevels = new Map()
        // @ts-ignore
        let mainMap = new Map()

        let vertices: Array<number> = []

        let newNumber = 1
        let level = 0

        let isVertixN0 = true

        // @ts-ignore
        let map = new Map();
        for (let column = 0; column < matrixSize; column++) {
            for (let row = 0; row < matrixSize; row++) {
                if (adjacencyMatrix[row][column] === '1') {
                    isVertixN0 = false
                    break
                }
            }
            if (isVertixN0) {
                vertices.push(column)
                mainMap.set(column + 1, newNumber)
                map.set(column + 1, newNumber)
                newNumber++
            } else {
                isVertixN0 = true
            }
        }
        mapLevels.set(level, map)

        let pastLevel = level
        level++

        while (true) {
            // @ts-ignore
            let map = new Map()

            console.log("Главная матрица")
            console.log(mapLevels)
            for (let column = 0; column < matrixSize; column++) {
                // let tempMap = mapLevels.get(pastLevel)
                // let key = column
                // if (tempMap.has(++key) || vertices.some((element) => element == column)) {
                if (vertices.some((element) => element == column)) {
                    continue
                } else {
                    // console.log("Столбец не из матрицы")
                    // console.log(column)
                    // console.log("tempMap")
                    // console.log(tempMap)
                    // console.log("mainMap")
                    // console.log(mainMap)
                    let isVertexLevel = true

                    for (let row = 0; row < matrixSize; row++) {
                        if (adjacencyMatrix[row][column] === '1') {
                            let keyRow = row
                            // if (!tempMap.has(keyRow + 1) && !mainMap.has(keyRow + 1)) {
                            if (!mainMap.has(keyRow + 1)) {
                                isVertexLevel = false
                            }

                        }
                    }

                    if (isVertexLevel) {
                        vertices.push(column)
                        map.set(column + 1, newNumber)
                        // console.log("map")
                        // console.log(map)
                        newNumber++
                    } else {
                        isVertexLevel = true
                    }
                }
            }

            if (map.size === 0) {
                break
            }

            map.forEach((value, key) => {
                mainMap.set(key, value)
            })
            mapLevels.set(level, map)

            pastLevel = level
            level++
        }
        console.log(mapLevels)
        return mapLevels
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

    // проверка графа на контуры (true - если есть контуры)
    function checkForContours(adjacencyMatrix, matrixSize) {

        for (let row = 0; row < matrixSize; row++) {
            for (let column = 0; column < matrixSize; column++) {
                if (adjacencyMatrix[row][column] === '1') {
                    let path = getPath(adjacencyMatrix, matrixSize, row, column)
                    if (path === null) {
                        return true
                    }
                }
            }
        }
        return false
    }

    // Получить путь в графе
    function getPath(adjacencyMatrix, matrixSize, firstRow, firstColumn) {
        let vertices = []
        vertices.push(firstRow + 1, firstColumn + 1)

        // console.log("firstColumn")
        // console.log(firstColumn)
        let row = firstColumn
        for (let column = 0; column < matrixSize; column++) {
            if (adjacencyMatrix[row][column] === '1') {
                // console.log(row)
                // console.log(column)
                let el = column
                vertices.push(++el)
                // если в массиве вершин есть повторяющиеся элементы (то есть появился контур) возвращаем null
                if (hasDuplicates(vertices)) {
                    return null
                } else {
                    row = column
                    column = -1
                }
            }
        }
        return vertices
    }


    function hasDuplicates(arr) {
        // console.log(arr)
        arr.sort();
        // console.log("Отсортированный массив вершин")
        // console.log(arr)

        for (let i = 0; i < arr.length; i++) {
            let index = i;
            if (arr[i] === arr[++index]) {
                return true
            }
        }
        return false
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
})
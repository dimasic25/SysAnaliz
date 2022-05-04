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

    button.addEventListener('click', (ev) => {

        let selectElement = document.querySelector('.matrix-size') as HTMLSelectElement;
        let matrixSize = selectElement.value

        let adjacencyMatrix = getAdjacencyMatrix(matrixSize)

        let rightIncidentSet = getRightIncidentMatrix(adjacencyMatrix, matrixSize)

        console.log(rightIncidentSet)

        let resultMatrix = getFilledMatrix(matrixSize, 0)

        for (let i = 1; i <= Number(matrixSize); i++) {
            let shortestPaths = getShortestPaths(i, rightIncidentSet, matrixSize)
            updateResultMatrix(resultMatrix, matrixSize, shortestPaths, i)
        }

        let absoluteCompact = getAbsoluteCompact(resultMatrix, matrixSize)

        console.log(absoluteCompact)

        let minCompact: number = Number(matrixSize) * (Number(matrixSize) - 1)

        console.log(minCompact)

        let relCompact = (absoluteCompact / minCompact) - 1

        console.log(relCompact)

        let diametr = resultMatrix[0][0]

        for (let row = 0; row < Number(matrixSize); row++) {
            for (let column = 0; column < Number(matrixSize); column++) {
                if (resultMatrix[row][column] > diametr) {
                    diametr = resultMatrix[row][column]
                }
            }
        }

        showCompacts(absoluteCompact, diametr, relCompact)
    })

    function showCompacts(absoluteCompact, diametr, relCompact) {

        let answer = document.querySelector('.answer-wrapper')
        clearElement(answer)

        let answerHeader = document.createElement('h2')
        answerHeader.textContent = "Показатели компактности\n"
        answer.appendChild(answerHeader)

        let row = document.createElement('div')

        if (relCompact >= 0) {
            row.innerHTML = `<span>Абсолютная компактность ${absoluteCompact}</span> <br>` +
                `<span>Относительная компактность ${relCompact}</span><br>` +
                `<span>Диаметр ${diametr}</span>`
        } else {
            row.innerHTML = '<span>Показатели компактности невозможно рассчитать</span> <br>' +
                `<span>Диаметр ${diametr}</span>`
        }

        answer.appendChild(row)
    }

    function getAbsoluteCompact(pathsMatrix, matrixSize) {
        let absoluteCompact = 0
        for (let row = 0; row < matrixSize; row++) {
            for (let column = 0; column < matrixSize; column++) {
                if (row !== column) {
                    absoluteCompact += pathsMatrix[row][column]
                }
            }
        }
        return absoluteCompact
    }

    function getShortestPaths(vertix: number, rightIncidentSet, matrixSize) {
        // @ts-ignore
        let indexMap = new Map()

        let index = 0

        indexMap.set(index, [vertix])
        // @ts-ignore
        let tagVertices = new Set()
        tagVertices.add(vertix)

        let tempVertices = indexMap.get(index)
        let vertices = [1]

        while (tagVertices.size < matrixSize && vertices.length !== 0) {
            tempVertices = indexMap.get(index)

            vertices = []

            tempVertices.forEach(function (value) {
                for (let row = 0; row < matrixSize; row++) {
                    if (rightIncidentSet[row][value - 1] === value) {
                        if (!tagVertices.has(row + 1)) {
                            vertices.push(row + 1)
                        }
                        tagVertices.add(row + 1)
                    }
                }
            })

            indexMap.set(++index, vertices)
        }

        return indexMap
    }

    function updateResultMatrix(resultMatrix, matrixSize, shortestPaths, index) {
        for (let row = 0; row < matrixSize; row++) {
            resultMatrix[row][index - 1] = findKey(shortestPaths, row + 1)
        }
    }

    function findKey(shortestPaths, value) {
        let val = -1;
        shortestPaths.forEach((array, key) => {
            if (findElement(value, array)) {
                val = key
                return
            }
        })
        return val
    }

    function findElement(element, array: Array<number>) {
        for (let index = 0; index < array.length; index++) {
            if (array[index] === element) {
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
})

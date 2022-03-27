document.addEventListener('DOMContentLoaded', () => {
    let select = document.querySelector('.matrix-size');

    select.addEventListener('change', (ev) => {
        let selectValue: string = (ev.target as HTMLSelectElement).value
        let matrixSize: number = parseInt(selectValue);
        let matrix = document.querySelector('.matrix');
        matrix.innerHTML = ""

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
        console.log("Матрица смежности")
        console.log(adjacencyMatrix)


        console.log(checkForContours(adjacencyMatrix, matrixSize))
    })

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


        for (let row = firstColumn++; row < matrixSize; row++) {
            for (let column = 0; column < matrixSize; column++) {
                if (adjacencyMatrix[row][column] === '1') {
                    let el = column
                    vertices.push(++el)
                    // если в массиве вершин есть повторяющиеся элементы (то есть появился контур) возвращаем null
                    if (hasDuplicates(vertices)) {
                        return null
                    } else {
                        row = column
                        column = 0
                    }
                }
            }
        }

        return vertices
    }


    function hasDuplicates(arr) {
        console.log(arr)
        arr.sort();
        console.log("Отсортированный массив вершин")
        console.log(arr)

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

})
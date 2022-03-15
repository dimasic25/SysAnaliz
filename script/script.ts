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

        let rightIncidentMatrix = getRightIncidentMatrix(adjacencyMatrix, matrixSize)
        console.log("Матрица правых инциденций")
        console.log(rightIncidentMatrix)
        let leftIncidentMatrix = getLeftIncidentMatrix(adjacencyMatrix, matrixSize)
        console.log("Матрица левых инциденций")
        console.log(leftIncidentMatrix)

        showLeftIncidentMatrix(leftIncidentMatrix, matrixSize)
        showRightIncidentMatrix(rightIncidentMatrix, matrixSize)
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

    function showLeftIncidentMatrix(matrix, matrixSize) {
        const leftIncidentMatrixWrapper = document.querySelector('.left-incident-matrix-wrapper')
        leftIncidentMatrixWrapper.innerHTML = ''

        let leftIncidentMatrixHeader = document.createElement('h2')
        leftIncidentMatrixHeader.textContent = "Множество левых инциденций"
        leftIncidentMatrixWrapper.appendChild(leftIncidentMatrixHeader)

        for (let i = 0; i < matrixSize; i++) {
            let row = document.createElement('div')
            row.className += "row"
            let rowVal = "";
            for (let j = 0; j < matrixSize; j++) {
                let val = matrix[i][j];
                rowVal += `${val !== null && val !== '0' ? val : ''} `
            }
            let index = i
            row.innerHTML = `<span>G<sup>-</sup>(${++index})</span> { ${rowVal}}`
            leftIncidentMatrixWrapper.appendChild(row)
        }
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

    // получить множество левых инциденций по матрице смежности
    function getLeftIncidentMatrix(adjacencyMatrix, matrixSize) {
        let arr = getFilledMatrix(matrixSize, null)

        for (let j = 0; j < matrixSize; j++) {
            for (let i = 0; i < matrixSize; i++) {
                let val
                if (adjacencyMatrix[i][j] !== '0') {
                    let index = i
                    val = ++index
                } else {
                    val = '0'
                }
                arr[j][i] = val;
            }
        }

        return arr
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
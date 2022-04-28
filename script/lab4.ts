// @ts-ignore
document.addEventListener('DOMContentLoaded', () => {
    let select = document.querySelector('.matrix-size');

    select.addEventListener('change', (ev) => {
        let selectValue: string = (ev.target as HTMLSelectElement).value
        let matrixSize: number = parseInt(selectValue);
        let rightSet = document.querySelector('.input-section__right-incident-set');
        clearElement(rightSet)

        for (let i: number = 0; i < matrixSize; i++) {
            rightSet.innerHTML += `
                <div class="right-incident-set__row">
                    <label class="right-incident-set__label">G<sup>+</sup>(${i + 1})</label>
                    <label>
                        <input class="right-incident-set__input" type="text">
                    </label>
                </div>`
        }
    })

    let button = document.querySelector('.btn')

    button.addEventListener('click', (ev) => {

        let selectElement = document.querySelector('.matrix-size') as HTMLSelectElement;
        let matrixSize = selectElement.value

        let rightIncidentSet = readRightIncidentSetFromUser(matrixSize)

        console.log(rightIncidentSet)

        let resultMatrix = getFilledMatrix(matrixSize, 0)

        for (let i = 1; i <= Number(matrixSize); i++) {
            let shortestPaths = getShortestPaths(i, rightIncidentSet, matrixSize)
            updateResultMatrix(resultMatrix, matrixSize, shortestPaths, i)
        }

        console.log(resultMatrix)

        showMatrix(resultMatrix)
    })

    function showMatrix(matrix): void {
        let matrixSize = matrix.length;
        let adjacentMatrixElement = document.querySelector('.answer__adjacent-matrix');

        adjacentMatrixElement.innerHTML = ''
        for (let i = 0; i < matrixSize; i++) {
            let rowValueAsString = ''
            for (let j = 0; j < matrixSize; j++) {
                let currentNumber = matrix[i][j]
                rowValueAsString += `${currentNumber} `
            }
            adjacentMatrixElement.innerHTML += `<div>${rowValueAsString}</div>`
        }
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

    function readRightIncidentSetFromUser(matrixSize) {
        let matrix = getFilledMatrix(matrixSize, '0')
        let rightIncidentSetInputs = findAllInputsInDocument('.right-incident-set__input')

        for (let i = 0; i < matrixSize; i++) {
            let stringMatrixRow = rightIncidentSetInputs[i].value.split(' ')
            for (let j = 0; j < matrixSize; j++) {
                let currentNumber = +stringMatrixRow[j]
                // @ts-ignore
                if (Number.isInteger(currentNumber) && numberBetweenWithInclude(1, currentNumber, matrixSize)) {
                    let idx = currentNumber - 1 // индекс на 1 меньше тех чисел, которые ввел пользователь
                    matrix[i][idx] = currentNumber // ставим номер на "свое место"
                }
            }
        }

        return matrix
    }

    function numberBetweenWithInclude(left, number, right) {
        return left <= number && number <= right
    }

    function findAllInputsInDocument(selector: string): NodeListOf<HTMLInputElement> {
        return document.querySelectorAll(selector)
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
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

        let shortestPaths = getShortestPaths(1, rightIncidentSet, matrixSize)

        console.log(shortestPaths)
    })

    function getShortestPaths(vertix, rightIncidentSet, matrixSize) {
        // @ts-ignore
        let indexMap = new Map()

        let index = 0

        indexMap.set(index, vertix)
        // @ts-ignore
        let tagVertices = new Set()
        tagVertices.add(vertix)

        while (tagVertices.size !== matrixSize) {
            let tempVertices = new Array(indexMap.get(index))

            let vertices = []

            tempVertices.forEach(function (value) {
                for (let row = 0; row < matrixSize; row++) {
                    if (rightIncidentSet[row][value - 1] === value) {
                        vertices.push(row + 1)
                        tagVertices.add(row + 1)
                    }
                }
            })

            indexMap.set(++index, vertices)
        }

        return indexMap
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
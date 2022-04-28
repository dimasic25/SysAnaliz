// @ts-ignore
document.addEventListener('DOMContentLoaded', function () {
    var select = document.querySelector('.matrix-size');
    select.addEventListener('change', function (ev) {
        var selectValue = ev.target.value;
        var matrixSize = parseInt(selectValue);
        var rightSet = document.querySelector('.input-section__right-incident-set');
        clearElement(rightSet);
        for (var i = 0; i < matrixSize; i++) {
            rightSet.innerHTML += "\n                <div class=\"right-incident-set__row\">\n                    <label class=\"right-incident-set__label\">G<sup>+</sup>(".concat(i + 1, ")</label>\n                    <label>\n                        <input class=\"right-incident-set__input\" type=\"text\">\n                    </label>\n                </div>");
        }
    });
    var button = document.querySelector('.btn');
    button.addEventListener('click', function (ev) {
        var selectElement = document.querySelector('.matrix-size');
        var matrixSize = selectElement.value;
        var rightIncidentSet = readRightIncidentSetFromUser(matrixSize);
        console.log(rightIncidentSet);
        var resultMatrix = getFilledMatrix(matrixSize, 0);
        for (var i = 1; i <= Number(matrixSize); i++) {
            var shortestPaths = getShortestPaths(i, rightIncidentSet, matrixSize);
            updateResultMatrix(resultMatrix, matrixSize, shortestPaths, i);
        }
        console.log(resultMatrix);
        showMatrix(resultMatrix);
    });
    function showMatrix(matrix) {
        var matrixSize = matrix.length;
        var adjacentMatrixElement = document.querySelector('.answer__adjacent-matrix');
        adjacentMatrixElement.innerHTML = '';
        for (var i = 0; i < matrixSize; i++) {
            var rowValueAsString = '';
            for (var j = 0; j < matrixSize; j++) {
                var currentNumber = matrix[i][j];
                rowValueAsString += "".concat(currentNumber, " ");
            }
            adjacentMatrixElement.innerHTML += "<div>".concat(rowValueAsString, "</div>");
        }
    }
    function getShortestPaths(vertix, rightIncidentSet, matrixSize) {
        // @ts-ignore
        var indexMap = new Map();
        var index = 0;
        indexMap.set(index, [vertix]);
        // @ts-ignore
        var tagVertices = new Set();
        tagVertices.add(vertix);
        var tempVertices = indexMap.get(index);
        var vertices = [1];
        while (tagVertices.size < matrixSize && vertices.length !== 0) {
            tempVertices = indexMap.get(index);
            vertices = [];
            tempVertices.forEach(function (value) {
                for (var row = 0; row < matrixSize; row++) {
                    if (rightIncidentSet[row][value - 1] === value) {
                        if (!tagVertices.has(row + 1)) {
                            vertices.push(row + 1);
                        }
                        tagVertices.add(row + 1);
                    }
                }
            });
            indexMap.set(++index, vertices);
        }
        return indexMap;
    }
    function updateResultMatrix(resultMatrix, matrixSize, shortestPaths, index) {
        for (var row = 0; row < matrixSize; row++) {
            resultMatrix[row][index - 1] = findKey(shortestPaths, row + 1);
        }
    }
    function findKey(shortestPaths, value) {
        var val = -1;
        shortestPaths.forEach(function (array, key) {
            if (findElement(value, array)) {
                val = key;
                return;
            }
        });
        return val;
    }
    function findElement(element, array) {
        for (var index = 0; index < array.length; index++) {
            if (array[index] === element) {
                return true;
            }
        }
        return false;
    }
    function readRightIncidentSetFromUser(matrixSize) {
        var matrix = getFilledMatrix(matrixSize, '0');
        var rightIncidentSetInputs = findAllInputsInDocument('.right-incident-set__input');
        for (var i = 0; i < matrixSize; i++) {
            var stringMatrixRow = rightIncidentSetInputs[i].value.split(' ');
            for (var j = 0; j < matrixSize; j++) {
                var currentNumber = +stringMatrixRow[j];
                // @ts-ignore
                if (Number.isInteger(currentNumber) && numberBetweenWithInclude(1, currentNumber, matrixSize)) {
                    var idx = currentNumber - 1; // индекс на 1 меньше тех чисел, которые ввел пользователь
                    matrix[i][idx] = currentNumber; // ставим номер на "свое место"
                }
            }
        }
        return matrix;
    }
    function numberBetweenWithInclude(left, number, right) {
        return left <= number && number <= right;
    }
    function findAllInputsInDocument(selector) {
        return document.querySelectorAll(selector);
    }
    function getFilledMatrix(matrixSize, value) {
        var arr = [];
        for (var i = 0; i < matrixSize; i++) {
            var subArr = [];
            for (var j = 0; j < matrixSize; j++) {
                subArr.push(value);
            }
            arr.push(subArr);
        }
        return arr;
    }
    function clearElement(element) {
        element.innerHTML = "";
    }
});

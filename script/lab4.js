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
        var shortestPaths = getShortestPaths(1, rightIncidentSet, matrixSize);
        console.log(shortestPaths);
    });
    function getShortestPaths(vertix, rightIncidentSet, matrixSize) {
        // @ts-ignore
        var indexMap = new Map();
        var index = 0;
        indexMap.set(index, vertix);
        // @ts-ignore
        var tagVertices = new Set();
        tagVertices.add(vertix);
        var _loop_1 = function () {
            var tempVertices = new Array(indexMap.get(index));
            var vertices = [];
            tempVertices.forEach(function (value) {
                for (var row = 0; row < matrixSize; row++) {
                    if (rightIncidentSet[row][value - 1] === value) {
                        vertices.push(row + 1);
                        tagVertices.add(row + 1);
                    }
                }
            });
            indexMap.set(++index, vertices);
        };
        while (tagVertices.size !== matrixSize) {
            _loop_1();
        }
        return indexMap;
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

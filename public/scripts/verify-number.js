
var input = document.getElementsByTagName('input');

let emptyCellCount = 0
for (let i = 0; i < input.length; ++i) {
    input[i].addEventListener('keydown', function (e) {
        let key = e.keyCode
        if (!(key === 9 || key === 8 || (key >= 48 && key <= 57)))
            e.preventDefault()
        else if (!key === 8)
            emptyCellCount = 0
    })

    input[i].addEventListener('keyup', function (e) {
        let key = e.keyCode
        if (key === 9 || (key >= 48 && key <= 57)) {
            let nextIndex = (i == input.length - 1 ? input.length - 1 : i + 1)
            emptyCellCount = 0
            input[nextIndex].focus()
        }
        else if (key === 8) {
            emptyCellCount++
            let nextIndex = (i == 0 ? 0 : i - 1)
            if (emptyCellCount == 2) {
                emptyCellCount = 0
                input[nextIndex].focus()
            }
        }
    })
}




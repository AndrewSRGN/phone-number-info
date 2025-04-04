
const btn = document.getElementById('btn');
const input = document.getElementById('tel');
const output = document.getElementById('output');

btn.addEventListener('click', () => {


})

const getMask = (number) => {
    const firstNumber = number[0];
    const secondNumber = number[1];
    const thirdNumber = number[2];
    const fourthNumber = number[3];



    if (!firstNumber) return 'Unknown';
    if (firstNumber === '1') {
        if (firstNumber && !secondNumber) return internationalMask[firstNumber].value;
        if (secondNumber && !thirdNumber) return internationalMask[firstNumber][secondNumber].value;
        if (thirdNumber && !fourthNumber) return internationalMask[firstNumber][secondNumber][thirdNumber].value;
        return internationalMask[firstNumber][secondNumber][thirdNumber][fourthNumber].value;
    }

    if (firstNumber && !secondNumber) return internationalMask[firstNumber].value;
    if (secondNumber && !thirdNumber) return internationalMask[firstNumber][secondNumber].value;
    return internationalMask[firstNumber][secondNumber][thirdNumber].value;
}

input.addEventListener('input', (e) => {
    console.log(e.target.value);
    const number = e.target.value.replace(/\D/g, '');


    const mostRelevantMask = getMask(number);



    output.textContent = JSON.stringify(mostRelevantMask);


    //output.textContent = internationalMask(input.value);
})
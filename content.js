// console.log('retail loaded')

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // listen for messages sent from background.js
        if (request.message === 'pageUpdate') {
            // console.log('page updated')
            // console.log(request.url)

            // setTimeout(() => {
            //     mainFunc();
            //     console.log('logic fired')
            // }, 2000);

            // запускаем проверку того запустилась ли страница
            let repeatTest = setInterval(function () {
                // проверяем есть ли товар на странице
                let pageLoadedTest = $('[data-product-id]');

                if (pageLoadedTest.length > 0) {
                    // если есть товар на странице - запускаем функцию
                    mainFunc();

                    // останавливаем проверку
                    clearInterval(repeatTest);
                    // console.log('page loaded')
                }
                else {
                    // console.log('page not loaded');
                }
            }, 500)



        }
    });


let mainFunc = function () {
    // console.log('yes, logic fired')
    // Смотрим где сделана покупка
    let method = $("#intaro_crmbundle_ordertype_orderMethod option:selected").text();

    // Если Яндекс-FBS = работаем
    if (method == "Яндекс-FBS") {

        // Берем все элементы с указанием веса
        let weightEl = $("[data-weight");

        // Общий вес
        let totalWeight = 0;

        // Складываем все элементы с весом в общий вес
        for (let i = 0; i < weightEl.length; i++) {
            var countItems = $("input.quantity")[i].value;
            totalWeight = totalWeight + (parseInt(weightEl[i].dataset.weight) * parseInt(countItems));
        }

        // Общий вес вводим в инпут
        $("#intaro_crmbundle_ordertype_weight").val(totalWeight);

        // Способ подтверждения = СМС
        $('#intaro_crmbundle_ordertype_customFields_confirm_type').val('1');

        // Через 0,1 сек кликаем "Рассчитать вес и габариты"
        setTimeout(() => {
            $('#calculate-weight-btn')[0].click();
        }, 100);

        // Через 0,2 сек кликаем "выбрыть тариф"
        setTimeout(() => {
            $(".deliveries-popup-open")[0].click();
        }, 200);

        // Каждые 0,4 сек проверяем открылось ли окошко с тарифами
        let tarifExists = setInterval(function () {

            // Нужный нам тариф
            var tarif = $('.delivery_popup__term');

            // Проверяем есть ли элемент на странице
            if (tarif.length > 0) {
                tarif[0].click();
                stopInterval();
                // console.log('Нужный тариф выбран')
            }

            else {
                // console.log('Нужный тариф не найден')
            }

        }, 400);

        function stopInterval() {
            clearInterval(tarifExists);
        }
    }
}


mainFunc();
$('.task').click(function () {
    $(this).toggleClass('collapsed');
})

$('textarea').click(function (e) {
    e.stopPropagation();
})
$('input').click(function (e) {
    e.stopPropagation();
})
    .focus(function () {
        $(this).closest('.task').addClass('pending');
    })

$('input').focusout(function () {
    $(this).closest('.task').removeClass('pending');

    if ($(this).val().length != 0) {
        $(this).closest('.task').addClass('success').removeClass('error');
        //глубокая проверка
    }
    else {
        $(this).closest('.task').removeClass('success').removeClass('error');
    }
})

$('#anketa').submit(function () {
    checkForm();
    return false;
})

function checkForm() {
    var foundErrorFlag = false;

    $('input').each(function () {

        if (!$(this).val()) {
            if (!foundErrorFlag) {
                $('.btn > input').val('Есть ошибки в заполнении')
                $(this).focus().closest('.task').addClass('error').removeClass('collapsed')
                $('#anketa').addClass('error');
                foundErrorFlag = true;
            }
        }
        else {
            $(this).closest('.task').addClass('success').removeClass('error');
        }
    })
}
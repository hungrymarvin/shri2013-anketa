var source = $("#tasks__task-template").html();
var template = Handlebars.compile(source);
var result = template(data);

$('#tasks-form').prepend(result);

var needToFillAllOfThem = true;

$('.tasks__task').click(function () {
    var task_text = $(this).find('.task__text');

    if (!$(this).hasClass('collapsed')) {
        $(this).addClass('collapsed');
        setTimeout(function () {
            $(task_text).css('white-space', 'nowrap');
        }, 300);
    }
    else {


        $(this).removeClass('collapsed');
        $(task_text).css('white-space', 'initial');
        $(this).find('input').focus();
    }
})

$('textarea, input, label').click(function (e) {
    e.stopPropagation();
});

$('input[type="radio"]').click(function () {
    redrawTask(this);
})


$('input, textarea').keyup(function () {

    redrawTask(this);
})

$('input, textarea').focus(function () {

    var task = $(this).closest('.tasks__task');

    $(task).addClass('pending').removeClass('collapsed');
    $(task).next().removeClass('collapsed');
    redrawTask(this);
})

$('input, textarea').focusout(function () {

    $(this).closest('.tasks__task').removeClass('pending');
    redrawTask(this);
})

$('#tasks-form').submit(function () {

    var result = checkForm();

    if (result) {
        result.focus();
        $(result).closest('.tasks__task').addClass('error').removeClass('collapsed')
        return false;
    }
    else
        return true;


})

function checkForm() {

    var foundErrorFlag = 0;
    var errorElement = null;

    $('input, textarea').each(function () {

        var tmp = isValidInputValue(this);
        if ((foundErrorFlag == 0) || (tmp > foundErrorFlag)) {
            foundErrorFlag = tmp;
            errorElement = this;
        }

        if ((foundErrorFlag == 1) && (!needToFillAllOfThem))
            foundErrorFlag = 0;

    })

    switch (foundErrorFlag) {
        case 0:
            $('.tasks__button').addClass('success');
            $('.tasks__button > input').val('Отправить!');
            break;

        case 1:
            $('.tasks__button').removeClass('success').removeClass('error');
            $('.tasks__button > input').val('Заполните анкету');
            break;

        case 2:
            $('.tasks__button').addClass('error');
            $('.tasks__button > input').val('Есть ошибки');
            break;

    }
    if (foundErrorFlag == 0)
        return null;
    else
        return errorElement;
}

function checkFormSilent() {

    var foundErrorFlag = 0;


    $('input, textarea').each(function () {
        var tmp = isValidInputValue(this);
        if ((foundErrorFlag == 0) || (tmp > foundErrorFlag)) {
            foundErrorFlag = tmp;
        }

        if ((foundErrorFlag == 1) && (!needToFillAllOfThem))
            foundErrorFlag = 0;

    })

    switch (foundErrorFlag) {
        case 0:
            $('.tasks__button').addClass('success');
            $('.tasks__button > input').val('Отправить!');
            break;

        case 1:
            $('.tasks__button').removeClass('success').removeClass('error');
            $('.tasks__button > input').val('Заполните анкету');
            break;

        case 2:
            $('.tasks__button').addClass('error');
            $('.tasks__button > input').val('Есть ошибки');
            break;

    }
}

function redrawTask(element) {

    checkFormSilent();
    switch (isValidInputValue(element)) {
        case 0:
            $(element).closest('.tasks__task').addClass('success');
            break;

        case 1:
            $(element).closest('.tasks__task').removeClass('success').removeClass('error');
            break;

        case 2:
            $(element).closest('.tasks__task').addClass('error');
            break;

    }
}

function isValidInputValue(element) {
    if ($(element).val() == '') {
        return 1;
    }
    else {
        switch (element.id) {
            case "q1":
                if (!isNaN($(element).val())) {
                    if (($(element).val() > 1940) && ($(element).val() < new Date().getFullYear()))
                        return 0;
                    else
                        return 2;

                }
                else {
                    return 2;
                }
                break;

            case "q4":
                if (!isNaN($(element).val())) {
                    if ($(element).val() > 1940)
                        return 0;
                    else
                        return 2;

                }
                else {
                    return 2;
                }
                break;

            case "q13", "q14":
                if (($(element).val().indexOf('github.com/') != -1) || ($(element).val().indexOf('jsfiddle.net/') != -1)) {
                    return 0;
                }
                else {
                    return 2;
                }
                break;

            case "q15":
                if ($(element).val().indexOf('github.com/') != -1) {
                    return 0;
                }
                else {
                    return 2;
                }
                break;
            case "a5_1", "a5_2", "a5_3":
                if (!$('#a5_1').prop("checked") && !$('#a5_2').prop("checked") && !$('#a5_3').prop("checked")) {
                    return 1;
                }
                else {
                    if ($('#a5_1').prop("checked") || $('#a5_2').prop("checked") || $('#a5_3').prop("checked")) {
                        return 0;
                    }
                    else {
                        return 2;
                    }
                }
                break;


            default:
                return 0;
        }
    }
}

function openAllQuestions() {
    $('.tasks__task').each(function () {
        $(this).removeClass('collapsed');

    });
    return false;
}

function closeAllQuestions() {
    $('.tasks__task').each(function () {
        $(this).addClass('collapsed');
    })

    return false;
}

function clearForm() {
    $('input[type="text"], textarea').each(function () {
        $(this).val('');
    })

    $('#a5_1').prop("checked", false);
    $('#a5_2').prop("checked", false);
    $('#a5_3').prop("checked", false);

    $('.tasks__task').each(function () {
        $(this).removeClass('success').removeClass('error');
    })
    checkFormSilent();
    return false;
}

$(function () {
    $('#q1').focus();
    checkFormSilent();
})


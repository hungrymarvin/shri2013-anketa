var source = $("#tasks__task-template").html();
var template = Handlebars.compile(source);
var result = template(data);

$('#tasks-form').prepend(result);

var needToFillAllOfThem = true;
var ctrlDown = false;
var ctrlKey = 17, vKey = 86;

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
        $(this).find('input, textarea').focus();
    }
})

$('textarea, input, label').click(function (e) {
    e.stopPropagation();
});

$('input[type="radio"]').click(function () {
    redrawTask(this);
})


$('input, textarea').keydown(function (e) {

    if (e.keyCode == ctrlKey) ctrlDown = true;

    var tabKeyCode = 9;
    if (e.keyCode != tabKeyCode) {
        var task = $(this).closest('.tasks__task');
        $(task).addClass('pending').removeClass('success').removeClass('error');
        $(task).next().removeClass('collapsed');
    }

}).keyup(function (e) {
        if (ctrlDown && (e.keyCode == vKey)) {
            redrawTask(this);
        }
        if (e.keyCode == ctrlKey) ctrlDown = false;
    });

$('input, textarea').focus(function () {

    var task = $(this).closest('.tasks__task');
    $(task).addClass('pending').removeClass('collapsed');
})

$('input, textarea').focusout(function () {

    $(this).closest('.tasks__task').removeClass('pending');
    redrawTask(this);
})

$('input[type="radio"]').click(function () {
    var task = $(this).closest('.tasks__task');
    $(task).next().removeClass('collapsed');
})

$('.tasks__button').click(function (e) {

    var result = checkForm();

    if (typeof result === "undefined") {

        $('#tasks-form').submit();

        return true;
    }
    else {
        result.focus().select();
        $(result).closest('.tasks__task').removeClass('success').removeClass('pending').addClass('error');
        return false;

    }
})

$('.tasks__button').hover(function () {
    checkFormSilent();
})

function checkForm() {

    var foundErrorFlag = 0;
    var errorElement = null;

    $('input, textarea').each(function () {

        var tmp = isValidInputValue(this);
        if (tmp > foundErrorFlag) {
            foundErrorFlag = tmp;
            errorElement = this;

        }

        if ((foundErrorFlag == 1) && (!needToFillAllOfThem))
            foundErrorFlag = 0;

    })

    switch (foundErrorFlag) {
        case 0:
            $('.tasks__button').addClass('success');
            $('.tasks__button__btn').text('Отправить!');
            break;

        case 1:
            $('.tasks__button').removeClass('success').removeClass('error');
            $('.tasks__button__btn').text('Заполните анкету');
            break;

        case 2:
            $('.tasks__button').addClass('error');
            $('.tasks__button__btn').text('Есть ошибки');
            break;

    }
    if (foundErrorFlag == 0)
        return undefined;
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
            $('.tasks__button__btn').text('Отправить!');
            break;

        case 1:
            $('.tasks__button').removeClass('success').removeClass('error');
            $('.tasks__button__btn').text('Заполните анкету');
            break;

        case 2:
            $('.tasks__button').addClass('error');
            $('.tasks__button__btn').text('Есть ошибки');
            break;

    }
}

function redrawTask(element) {

    checkFormSilent();
    var validationResult = isValidInputValue(element);
    switch (validationResult) {
        case 0:
            $(element).closest('.tasks__task').removeClass('error').addClass('success');

            break;

        case 1:
            $(element).closest('.tasks__task').removeClass('success').removeClass('error');
            break;

        case 2:
            $(element).closest('.tasks__task').removeClass('success').addClass('error');
            break;

    }

    return validationResult;
}

function isValidInputValue(element) {

    if ($(element).val() == '') {
        return 1;
    }
    else {
        switch (element.id) {
            case "q1":
                if (!isNaN($(element).val())) {
                    if (($(element).val() > 1940) && ($(element).val() < new Date().getFullYear() + 1))
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

            case "q13":
            case "q14":
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

            case "a5_1":
            case "a5_2":
            case "a5_3":
                if ($('#a5_1').prop("checked") || $('#a5_2').prop("checked") || $('#a5_3').prop("checked")) {
                    return 0;
                }
                else {
                    return 1;
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


from django.shortcuts import render


def chatPage(request):
    context = {}
    return render(request, "chatPage.html", context)

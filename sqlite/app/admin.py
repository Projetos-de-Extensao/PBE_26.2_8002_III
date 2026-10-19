from django.contrib import admin
from .models import Espaco, Produto, Servico

admin.site.register(Produto)
admin.site.register(Servico)
admin.site.register(Espaco)

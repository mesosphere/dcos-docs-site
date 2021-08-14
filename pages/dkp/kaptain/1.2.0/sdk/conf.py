project = 'Kaptain SDK'
copyright = '2020-2021 D2iQ'
author = 'D2iQ'

release = '0.2.0'

extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.napoleon',
    'sphinx.ext.autosummary',
    'sphinx.ext.autosectionlabel',
    'autoapi.extension',
]

autoapi_type = 'python'
autoapi_dirs = ['../../src/kaptain']
autoapi_root = 'api'
autoapi_ignore = ['*test*']
autoapi_member_order = 'alphabetical'
autoapi_python_use_implicit_namespaces = True
autoapi_template_dir = '_templates'
autodoc_typehints = 'description'

exclude_patterns = []
html_theme = 'bizstyle'

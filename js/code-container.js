function wrapCodeBlocks() {
$( 'pre' ).each( function() {
    $( this ).wrapAll( '<div class="code-container" />' );
} );
}

wrapCodeBlocks();

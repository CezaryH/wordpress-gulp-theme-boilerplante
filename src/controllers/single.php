<?php

$context = Timber::get_context(); 
$context['foo'] = 'Bar!'; 
$context['post'] = new TimberPost(); 
Timber::render('single.twig', $context);
<?php

function anyEmpty($array) {
    foreach ($array as $element) {
        if ($element == null) {
            return true;
        }
    }
    return false;
}

function checkLegalCharacters($input, $legalCharacters) {
    $input = str_split(strtolower($input));
    $legalCharacters = str_split($legalCharacters);

    foreach ($input as $inputCharacter) {
        $charIsLegal = false;
        foreach ($legalCharacters as $legalCharacter) {
            if ($inputCharacter == $legalCharacter) {
                $charIsLegal = true;
            }
        }
        if ($charIsLegal == false) {
            return false;
        }
    }
    return true;
}
module Main exposing (Model, Msg(..), init, main, update, view)

import Browser
import Data exposing (data)
import Dict exposing (Dict)
import Html exposing (Html, button, div, h1, h3, input, label, table, tbody, td, text, th, thead, tr)
import Html.Attributes exposing (class, colspan, for, id, placeholder, scope, type_, value)
import Html.Events exposing (onClick, onInput)
import List.Extra exposing (removeIfIndex)
import Tuple



-- MAIN


main : Program () Model Msg
main =
    Browser.sandbox { init = init, update = update, view = view }



-- Mode


type Mode
    = Quiz String ( Int, Int )
    | Default
    | WordsList ( Int, Int )



-- MODEL


type alias Model =
    { wordMeanings : Dict Int ( String, String ), mode : Mode, quizRange : ( Int, Int ), wordsListRange : ( Int, Int ) }


init : Model
init =
    Model data Default ( 0, 0 ) ( 1, 800 )



-- UPDATE


type Msg
    = StartQuiz
    | CreateWordsList
    | UpdateQuizRangeStart String
    | UpdateQuizRangeEnd String
    | UpdateWordsListRangeStart String
    | UpdateWordsListRangeEnd String


update : Msg -> Model -> Model
update msg model =
    case msg of
        CreateWordsList ->
            { model | mode = WordsList model.wordsListRange }

        UpdateQuizRangeStart start ->
            case model.quizRange of
                ( _, end ) ->
                    { model | quizRange = ( String.toInt start |> Maybe.withDefault 0, end ) }

        UpdateQuizRangeEnd end ->
            case model.quizRange of
                ( start, _ ) ->
                    { model | quizRange = ( start, String.toInt end |> Maybe.withDefault 0 ) }

        UpdateWordsListRangeStart start ->
            case model.wordsListRange of
                ( _, end ) ->
                    { model | wordsListRange = ( String.toInt start |> Maybe.withDefault 0, end ) }

        UpdateWordsListRangeEnd end ->
            case model.wordsListRange of
                ( start, _ ) ->
                    { model | wordsListRange = ( start, String.toInt end |> Maybe.withDefault 0 ) }

        _ ->
            model



-- VIEW


view : Model -> Html Msg
view model =
    div [ class "row" ]
        [ div [ class "col-4" ]
            [ div
                [ class "mb-3"
                ]
                [ h3 [] [ text "New Quiz" ]
                , label
                    [ class "form-label"
                    ]
                    [ text "Range" ]
                , div
                    [ class "input-group mb-3"
                    ]
                    [ input
                        [ type_ "number"
                        , class "form-control"
                        , placeholder "Start"
                        , value <|
                            String.fromInt <|
                                Tuple.first <|
                                    model.quizRange
                        , onInput UpdateQuizRangeStart
                        ]
                        []
                    , input
                        [ type_ "number"
                        , class "form-control"
                        , placeholder "End"
                        , value <|
                            String.fromInt <|
                                Tuple.second <|
                                    model.quizRange
                        , onInput UpdateQuizRangeEnd
                        ]
                        []
                    ]
                , button [ class "btn btn-outline-success" ] [ text "Start" ]
                , h3 [ class "mt-3" ] [ text "New Words List" ]
                , label
                    [ class "form-label"
                    ]
                    [ text "Range" ]
                , div
                    [ class "input-group mb-3"
                    ]
                    [ input
                        [ type_ "number"
                        , class "form-control"
                        , placeholder "Start"
                        , value <|
                            String.fromInt <|
                                Tuple.first <|
                                    model.wordsListRange
                        , onInput UpdateWordsListRangeStart
                        ]
                        []
                    , input
                        [ type_ "number"
                        , class "form-control"
                        , placeholder "End"
                        , value <|
                            String.fromInt <|
                                Tuple.second <|
                                    model.wordsListRange
                        , onInput UpdateWordsListRangeEnd
                        ]
                        []
                    ]
                , button [ class "btn btn-outline-success", onClick CreateWordsList ] [ text "Create" ]
                ]
            ]
        , div [ class "col-8" ]
            (case model.mode of
                WordsList range ->
                    let
                        start =
                            Tuple.first range |> String.fromInt

                        end =
                            Tuple.second range |> String.fromInt
                    in
                    [ h1 []
                        [ text <| "Words List (" ++ start ++ " to " ++ end ++ ")"
                        ]
                    , table
                        [ class "table"
                        ]
                        [ thead []
                            [ tr []
                                [ th
                                    [ scope "col"
                                    ]
                                    [ text "#" ]
                                , th
                                    [ scope "col"
                                    ]
                                    [ text "Word" ]
                                , th
                                    [ scope "col"
                                    ]
                                    [ text "Meaning" ]
                                ]
                            ]
                        , tbody []
                            (List.range (Tuple.first range) (Tuple.second range)
                                |> List.map
                                    (\index ->
                                        let
                                            item =
                                                Dict.get index model.wordMeanings |> Maybe.withDefault ( "Not found", "Not found" )
                                        in
                                        tr []
                                            [ th
                                                [ scope "row"
                                                ]
                                                [ text <| String.fromInt <| index ]
                                            , td []
                                                [ text <| Tuple.first item ]
                                            , td []
                                                [ text <| Tuple.second item ]
                                            ]
                                    )
                            )
                        ]
                    ]

                _ ->
                    []
            )
        ]

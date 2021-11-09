module Main exposing (Model, Msg(..), init, main, update, view)

import Browser
import Data exposing (data)
import Dict exposing (Dict)
import Html exposing (Html, a, button, div, h1, h3, hr, input, label, option, table, tbody, td, text, th, thead, tr)
import Html.Attributes exposing (class, href, placeholder, scope, type_, value)
import Html.Events exposing (onClick, onInput)
import Html.Events.Extra exposing (onClickPreventDefault)
import Random
import Random.List exposing (shuffle)
import Tuple


type Result
    = Correct
    | Incorrect


type alias Flags =
    ()



-- MAIN


main : Program Flags Model Msg
main =
    Browser.element { init = init, update = update, view = view, subscriptions = subscriptions }



-- Mode


type Mode
    = Quiz ( Int, Int )
    | WordsList ( Int, Int )



-- MODEL


type alias Model =
    { wordMeanings : Dict Int ( String, String )
    , mode : Mode
    , quizRange : ( Int, Int )
    , wordsListRange : ( Int, Int )
    , quizOptions : Dict Int (List Int)
    , markedOptions : Dict Int Int
    }


init : Flags -> ( Model, Cmd msg )
init _ =
    ( Model data (WordsList ( 1, 10 )) ( 1, 10 ) ( 1, 800 ) Dict.empty Dict.empty, Cmd.none )



-- UPDATE


type Msg
    = StartQuiz (Dict Int (List Int))
    | CreateWordsList
    | UpdateQuizRangeStart String
    | UpdateQuizRangeEnd String
    | UpdateWordsListRangeStart String
    | UpdateWordsListRangeEnd String
    | RandomizeNewQuiz
    | MarkOption Int Int


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        RandomizeNewQuiz ->
            case model.quizRange of
                ( start, end ) ->
                    let
                        quantity =
                            end - start + 1
                    in
                    ( model
                    , Random.generate StartQuiz
                        (Random.list quantity (List.range 0 799 |> shuffle |> Random.map (List.take 4))
                            |> Random.map
                                (\list ->
                                    list
                                        |> List.indexedMap (\index item -> ( index, item ))
                                        |> Dict.fromList
                                )
                        )
                    )

        StartQuiz options ->
            ( { model | mode = Quiz model.quizRange, quizOptions = options, markedOptions = Dict.empty }, Cmd.none )

        CreateWordsList ->
            ( { model | mode = WordsList model.wordsListRange }, Cmd.none )

        UpdateQuizRangeStart start ->
            case model.quizRange of
                ( _, end ) ->
                    ( { model | quizRange = ( String.toInt start |> Maybe.withDefault 0, end ) }, Cmd.none )

        UpdateQuizRangeEnd end ->
            case model.quizRange of
                ( start, _ ) ->
                    ( { model | quizRange = ( start, String.toInt end |> Maybe.withDefault 0 ) }, Cmd.none )

        UpdateWordsListRangeStart start ->
            case model.wordsListRange of
                ( _, end ) ->
                    ( { model | wordsListRange = ( String.toInt start |> Maybe.withDefault 0, end ) }, Cmd.none )

        UpdateWordsListRangeEnd end ->
            case model.wordsListRange of
                ( start, _ ) ->
                    ( { model | wordsListRange = ( start, String.toInt end |> Maybe.withDefault 0 ) }, Cmd.none )

        MarkOption wordIndex optionIndex ->
            ( { model | markedOptions = model.markedOptions |> Dict.insert wordIndex optionIndex }, Cmd.none )



-- VIEW


view : Model -> Html Msg
view model =
    div [ class "row" ]
        [ div [ class "col-sm-4" ]
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
                , button [ class "btn btn-outline-success", onClick RandomizeNewQuiz ] [ text "Start" ]
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
        , div [ class "col-sm-8" ]
            (case model.mode of
                Quiz range ->
                    let
                        start =
                            Tuple.first range |> String.fromInt

                        end =
                            Tuple.second range |> String.fromInt
                    in
                    h1 []
                        [ text <| "Quiz (" ++ start ++ " to " ++ end ++ ")"
                        ]
                        :: (List.range (Tuple.first range) (Tuple.second range)
                                |> List.map
                                    (\index ->
                                        let
                                            ( word, _ ) =
                                                Dict.get index model.wordMeanings |> Maybe.withDefault ( "Not found", "" )

                                            optionIndices =
                                                model.quizOptions |> Dict.get (index - 1) |> Maybe.withDefault [ 0, 1, 2, 3 ]

                                            correctOptionInIndices =
                                                optionIndices |> List.any (\index_ -> index_ == index)

                                            minOptionIndex =
                                                optionIndices |> List.minimum |> Maybe.withDefault 0

                                            options =
                                                List.map
                                                    (\index_ ->
                                                        let
                                                            ( result, finalIndex ) =
                                                                if not correctOptionInIndices && minOptionIndex == index_ then
                                                                    ( Correct, index )

                                                                else
                                                                    ( Incorrect, index_ )
                                                        in
                                                        Dict.get finalIndex model.wordMeanings
                                                            |> Maybe.withDefault ( "", "Not found" )
                                                            |> (\wordMeaning -> ( result, Tuple.second wordMeaning ))
                                                    )
                                                    optionIndices

                                            markedCorrectClass =
                                                options
                                                    |> List.indexedMap (\i item -> ( i, item ))
                                                    |> List.foldl
                                                        (\( i, ( result, _ ) ) acc ->
                                                            if acc == True then
                                                                True

                                                            else
                                                                case model.markedOptions |> Dict.get index of
                                                                    Just j ->
                                                                        if j == i && result == Correct then
                                                                            True

                                                                        else
                                                                            acc

                                                                    _ ->
                                                                        acc
                                                        )
                                                        False
                                                    |> (\correct ->
                                                            if correct then
                                                                " text-success"

                                                            else
                                                                ""
                                                       )
                                        in
                                        div []
                                            [ h3 [ class <| "my-3" ++ markedCorrectClass ] [ text <| String.fromInt index ++ ". " ++ word ]
                                            , div
                                                [ class "list-group list-group-numbered mb-3"
                                                ]
                                                (options
                                                    |> List.indexedMap
                                                        (\optionIndex ( result, meaning ) ->
                                                            let
                                                                contextualClass =
                                                                    case model.markedOptions |> Dict.get index of
                                                                        Just optionIndex_ ->
                                                                            if optionIndex_ == optionIndex then
                                                                                if result == Correct then
                                                                                    " list-group-item-success"

                                                                                else if result == Incorrect then
                                                                                    " list-group-item-danger"

                                                                                else
                                                                                    ""

                                                                            else
                                                                                ""

                                                                        Nothing ->
                                                                            ""
                                                            in
                                                            a
                                                                [ href "#"
                                                                , class <| "list-group-item list-group-item-action" ++ contextualClass
                                                                , onClickPreventDefault (MarkOption index optionIndex)
                                                                ]
                                                                [ text meaning ]
                                                        )
                                                )
                                            ]
                                    )
                           )

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
                        [ class "table table-sm table-striped"
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
                                            [ td
                                                [ class "fw-bold small-text"
                                                ]
                                                [ text <| String.fromInt <| index ]
                                            , td [ class "fw-bold small-text" ]
                                                [ text <| Tuple.first item ]
                                            , td [ class "small-text" ]
                                                [ text <| Tuple.second item ]
                                            ]
                                    )
                            )
                        ]
                    ]
            )
        ]


subscriptions : Model -> Sub msg
subscriptions model =
    Sub.none

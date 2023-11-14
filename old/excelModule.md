----------------------------------------------------------------------------------------------------------------
Function lastPrice(ticker)
    ticker = Trim(ticker)
     urlAddress = "http://localhost:3001/lastprice?ticker=" & ticker
     Set hReq = CreateObject("MSXML2.XMLHTTP")
        hReq.Open "POST", urlAddress, False
        hReq.Send ""
    response = hReq.ResponseText
    Debug.Print response
    lastPrice = CDbl(response)
End Function
----------------------------------------------------------------------------------------------------------------
Function priceAsOfDate(ticker, ddate)
    ticker = Trim(ticker)
    ddate = CStr(ddate)
    urlAddress = "http://localhost:3001/priceAsOfDate?ticker=" & ticker & "&ddate=" & ddate
     Set hReq = CreateObject("MSXML2.XMLHTTP")
        hReq.Open "POST", urlAddress, False
        hReq.Send ""
    response = hReq.ResponseText
    Debug.Print response
    priceAsOfDate = CDbl(response)

End Function
----------------------------------------------------------------------------------------------------------------
Function datedPrice(ticker, ddate)
    ticker = Trim(ticker)
    ddate = CStr(ddate)
    urlAddress = "http://localhost:3001/datedPrice?ticker=" & ticker & "&ddate=" & ddate
     Set hReq = CreateObject("MSXML2.XMLHTTP")
        hReq.Open "POST", urlAddress, False
        hReq.Send ""
    response = hReq.ResponseText
    Debug.Print response
    datedPrice = CDbl(response)
End Function
----------------------------------------------------------------------------------------------------------------
Function marketcap(ticker)
    ticker = Trim(ticker)
     urlAddress = "http://localhost:3001/marketcap?ticker=" & ticker
     Set hReq = CreateObject("MSXML2.XMLHTTP")
        hReq.Open "POST", urlAddress, False
        hReq.Send ""
    response = hReq.ResponseText
    Debug.Print response
    marketcap = CDbl(response)
End Function
----------------------------------------------------------------------------------------------------------------
Function priceCurrency(ticker)
    ticker = Trim(ticker)
     urlAddress = "http://localhost:3001/priceCurrency?ticker=" & ticker
     Set hReq = CreateObject("MSXML2.XMLHTTP")
        hReq.Open "POST", urlAddress, False
        hReq.Send ""
    response = hReq.ResponseText
    Debug.Print response
    
    response = Left(response, Len(response) - 1)
    response = Right(response, Len(response) - 1)
    
    priceCurrency = CStr(response)
End Function
----------------------------------------------------------------------------------------------------------------
Function sector(ticker)
    ticker = Trim(ticker)
     urlAddress = "http://localhost:3001/sector?ticker=" & ticker
     Set hReq = CreateObject("MSXML2.XMLHTTP")
        hReq.Open "POST", urlAddress, False
        hReq.Send ""
    response = hReq.ResponseText
    Debug.Print response
    
       response = Left(response, Len(response) - 1)
    response = Right(response, Len(response) - 1)
    
    sector = CStr(response)
End Function
----------------------------------------------------------------------------------------------------------------
Function industry(ticker)
    ticker = Trim(ticker)
     urlAddress = "http://localhost:3001/industry?ticker=" & ticker
     Set hReq = CreateObject("MSXML2.XMLHTTP")
        hReq.Open "POST", urlAddress, False
        hReq.Send ""
    response = hReq.ResponseText
    Debug.Print response
    
       response = Left(response, Len(response) - 1)
    response = Right(response, Len(response) - 1)
    
    industry = CStr(response)
End Function
----------------------------------------------------------------------------------------------------------------
Function description(ticker)
    ticker = Trim(ticker)
     urlAddress = "http://localhost:3001/description?ticker=" & ticker
     Set hReq = CreateObject("MSXML2.XMLHTTP")
        hReq.Open "POST", urlAddress, False
        hReq.Send ""
    response = hReq.ResponseText
    Debug.Print response
    
       response = Left(response, Len(response) - 1)
    response = Right(response, Len(response) - 1)
    
    description = CStr(response)
End Function
----------------------------------------------------------------------------------------------------------------
Function country(ticker)
    ticker = Trim(ticker)
     urlAddress = "http://localhost:3001/country?ticker=" & ticker
     Set hReq = CreateObject("MSXML2.XMLHTTP")
        hReq.Open "POST", urlAddress, False
        hReq.Send ""
    response = hReq.ResponseText
    Debug.Print response
    
       response = Left(response, Len(response) - 1)
    response = Right(response, Len(response) - 1)
    
    country = CStr(response)
End Function
----------------------------------------------------------------------------------------------------------------
Function site(ticker)
    ticker = Trim(ticker)
     urlAddress = "http://localhost:3001/site?ticker=" & ticker
     Set hReq = CreateObject("MSXML2.XMLHTTP")
        hReq.Open "POST", urlAddress, False
        hReq.Send ""
    response = hReq.ResponseText
    Debug.Print response
    
       response = Left(response, Len(response) - 1)
    response = Right(response, Len(response) - 1)
    
    site = CStr(response)
End Function
----------------------------------------------------------------------------------------------------------------
Function earningsDate(ticker)
    ticker = Trim(ticker)
     urlAddress = "http://localhost:3001/earningsDate?ticker=" & ticker
     Set hReq = CreateObject("MSXML2.XMLHTTP")
        hReq.Open "POST", urlAddress, False
        hReq.Send ""
    response = hReq.ResponseText
    Debug.Print response
    
       response = Left(response, Len(response) - 1)
    response = Right(response, Len(response) - 1)
    
    earningsDate = CStr(response)
End Function
----------------------------------------------------------------------------------------------------------------


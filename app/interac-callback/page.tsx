'use client'

import rsa from 'jsrsasign'
import { useSearchParams } from 'next/navigation'
import Link from "next/link";

export default async function Page() {
    const searchParams = useSearchParams()
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const typeStr = searchParams.get('type')
    const type: number = typeStr ? parseInt(typeStr, 10) : 1;
    const cfg = {
        userInfoUrl: 'https://gateway-devportal2.pp.vids.dev/userinfo',
        tokenUrl: 'https://gateway-devportal2.pp.vids.dev/oauth2/token',
        callbackUrl: 'http://localhost:3000/interac-callback',
        kid: 'interac.poc.key',
        clientIds: [
            '09ee2e7c-a1df-4ad8-9468-ff5fa543b978',
            'be5b04e7-66b6-46b2-a3f6-41c978027e23',
            '39f1d587-6c40-41b0-a1b9-00ea5910e745',
        ],
        issuers: [
            '09ee2e7c-a1df-4ad8-9468-ff5fa543b978',
            'be5b04e7-66b6-46b2-a3f6-41c978027e23',
            '39f1d587-6c40-41b0-a1b9-00ea5910e745',
        ],
        audience: 'https://gateway-devportal2.pp.vids.dev/oauth2/token',
        privateKey: `-----BEGIN PRIVATE KEY-----
MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAxtqqvU1ZTj+lJEYT
b54xMaDSc5s9Ak2e/bJqtOOUqiEaW9WvtM8OMIPBoOvE/HLsMl+CQlTMlHQBiuW3
Di9BqQIDAQABAkAsiVDwMOCti8eaxi8YMp/l85Tu23fgii3vuAP6G3ZyW65czb5g
Wuvp38cwOlrEKiHKYb6+OoOArcmzYfJuO2g5AiEA8GLQ5oq6D4lKAi2/qVeXOYFd
TnqRtIpW4UwEFAaO2DcCIQDTxUBy1FGvWi0jCc0kN0cZ1DZ4kX+aBkEVM9R0Y6YF
HwIgcgDbQ8rdDMs2fywFLqGsxYf1oWd9vJqzM2wirwChNCcCIHy0vsQgNc4eO1BT
2EMIbk1Og5kyjULlhfP3Zpf3im+fAiEAqKBsaw1zJCWWrV9aNHDJCZAHJAOYwHYP
Z7In/rUwMco=
-----END PRIVATE KEY-----`,
    }

    function uuid(): string {
        return rsa.KJUR.crypto.Util.getRandomHexOfNbytes(16);
    }
    function sign(headerObj, payloadObj): string {
        const hJson = JSON.stringify(headerObj);
        const pJson = JSON.stringify(payloadObj);
        const jwt = rsa.KJUR.jws.JWS.sign("RS256", hJson, pJson, cfg.privateKey);
        return jwt;
    }

    const header = {
        alg: "RS256",
        kid: cfg.kid,
    };
    const now = new Date();
    const iat = Math.floor(now.getTime() / 1000);
    now.setHours(now.getHours() + 1);
    const exp = Math.floor(now.getTime() / 1000);
    const issuer = cfg.issuers[type - 1];
    const clientId = cfg.clientIds[type - 1];
    const queryStr = type === 1 ? '' : ('?type=' + type);
    const callbackUrl = cfg.callbackUrl + queryStr;
    const payload = {
        aud: cfg.audience,
        exp,
        iat,
        iss: issuer,
        jti: uuid(),
        sub: clientId,
    }
    const assertionJWT = sign(header, payload)
    const req = {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: callbackUrl,
        client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        client_id: clientId,
        client_assertion: assertionJWT,
    }
    let formBody = [];
    for (let prop in req) {
        const encodedVal = encodeURIComponent(req[prop])
        formBody.push(`${prop}=${encodedVal}`)
    }
    const body = formBody.join('&');
    const accessToken = await fetch(cfg.tokenUrl, {
        method: "POST",
        body: body,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": "SameSite=None",
        },
    }).then(response => response.json())
        .then(json => json["access_token"]);
    const userInfo = await fetch(cfg.userInfoUrl, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "Cookie": "SameSite=None",
        },
    }).then(response => response.json())
        .then(json => JSON.stringify(json));

    return (<div>
        <h1>Interac Callback Result</h1>
        <br/>
        {type === 1 && <h2>IVS & IDVS</h2>}
        {type === 2 && <h2>IVS</h2>}
        {type === 3 && <h2>IDVS</h2>}
        <br/>
        <p>Interac Callback Code: {code}</p>
        <p>Interac Access Token: {accessToken}</p>
        <p>User Info: {userInfo}</p>
        <div style={{height: "50px"}}></div>
        <Link href="/interac">Start Over a New Test</Link>
    </div>)
}
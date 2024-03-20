import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { createObjectCsvWriter } from 'csv-writer';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';

function extractLinksFromCode(code) {
  const regex = /(https:\/\/shope\.ee\/\w+)/g;
  const matches = code.match(regex);
  return matches;
}

@Injectable()
export class CustomService {
  constructor(private readonly httpService: HttpService) {}

  async newLink(oldLink: string) {
    const response = this.httpService.post(
      `https://affiliate.shopee.vn/api/v3/gql`,
      {
        operationName: 'batchGetCustomLink',
        query:
          '\n    query batchGetCustomLink($linkParams: [CustomLinkParam!], $sourceCaller: SourceCaller){\n      batchCustomLink(linkParams: $linkParams, sourceCaller: $sourceCaller){\n        shortLink\n        longLink\n        failCode\n      }\n    }\n    ',
        variables: {
          linkParams: [
            {
              originalLink: oldLink,
              advancedLinkParams: {
                subId1: 'shopee',
                subId2: 'kol',
                subId3: '2024',
                subId4: '1ivr8z9zyg',
                subId5: 'phuong',
              },
            },
          ],
          sourceCaller: 'CUSTOM_LINK_CALLER',
        },
      },
      {
        headers: {
          Cookie:
            '_gcl_au=1.1.747719271.1708618377; _med=refer; _fbp=fb.1.1708618376790.655147262; SPC_F=j3Qij3UaxVqZBp4cuoIHhV25pQfnxQK7; REC_T_ID=45cb04a5-d19d-11ee-8672-c276d5c51f77; SPC_CLIENTID=ajNRaWozVWF4VnFabhiylefrbgngwuks; _med=affiliates; SC_DFP=gvMpvICokUCcRoHfODPWNldOQgPKpwBW; _gid=GA1.2.1453338189.1710607905; SPC_EC=.eTBpYWVQak5acFk3WWxNQZGggwrRR8J7xP15HV9GPPOerz3o+z7ZMQxLW8VA40Lok85zi2VcRaGd16PCNop/UvK6djE0gka4k0F9vgPhPVYkwE3WpNEYXMeVQwaFBuyW34JVENxEB/hdsGX4v2YomdlUNYiQnNcCvP67zEZTGjq7zpILUoAyvU6mSAVJzP0X++9LC6EpGKYtjjYk1bB0kA==; SPC_ST=.eTBpYWVQak5acFk3WWxNQZGggwrRR8J7xP15HV9GPPOerz3o+z7ZMQxLW8VA40Lok85zi2VcRaGd16PCNop/UvK6djE0gka4k0F9vgPhPVYkwE3WpNEYXMeVQwaFBuyW34JVENxEB/hdsGX4v2YomdlUNYiQnNcCvP67zEZTGjq7zpILUoAyvU6mSAVJzP0X++9LC6EpGKYtjjYk1bB0kA==; language=vi; link_social_media_641954921=1; SPC_U=641954921; SPC_SI=OxbwZQAAAABkd25hVmc0czeO0QAAAAAAeTNQOGZlWE8=; SPC_T_IV=N1BleFhlemdJcFNQdGlwVQ==; SPC_R_T_ID=gClEcMins+Awzr0PrMvo1TD3zciKhcR/+BT8FMTUDqcx4MHoRI1f0OrUtO2mkvJu3JcL8ET5abIgjQWOAZTatzCLTHY3JgRNwc6fBjXbFDiKcEc7mqgKQDQheXJgf9STaH6K0P6BhLqTIZyGVHlDcrIPd656cWJcCYr1biNq2vc=; SPC_R_T_IV=N1BleFhlemdJcFNQdGlwVQ==; SPC_T_ID=gClEcMins+Awzr0PrMvo1TD3zciKhcR/+BT8FMTUDqcx4MHoRI1f0OrUtO2mkvJu3JcL8ET5abIgjQWOAZTatzCLTHY3JgRNwc6fBjXbFDiKcEc7mqgKQDQheXJgf9STaH6K0P6BhLqTIZyGVHlDcrIPd656cWJcCYr1biNq2vc=; AMP_TOKEN=%24NOT_FOUND; _ga_4GPP1ZXG63=GS1.1.1710921102.11.1.1710921103.59.0.0; _ga=GA1.1.2061315329.1708618377; _ga_TEVYGNDY1K=GS1.1.1710921253.2.0.1710921254.59.0.0',
          'content-type': 'application/json; charset=UTF-8',
        },
      },
    );
    const result = await lastValueFrom(
      response.pipe(map((response) => response)),
    );
    const res = {
      data: result.data,
    };
    return res.data.data.batchCustomLink[0].shortLink;
  }

  async customLink(file: any) {
    const dataOld = readFileSync(file.path, 'utf8');
    const csv1 = readFileSync(
      '/Users/dipro/affiliate-auto-change-link/csv1.xlsx',
      'utf8',
    );
    const csv2 = readFileSync(
      '/Users/dipro/affiliate-auto-change-link/csv2.xlsx',
      'utf8',
    );
    const linksCsv1 = extractLinksFromCode(csv1);
    const linksCsv2 = extractLinksFromCode(csv2);

    const data = [];
    for (let i = 0; i < linksCsv1.length; i++) {
      data.push({ link1: linksCsv1[i], link2: linksCsv2[i] });
    }

    let dataNew = dataOld;
    for (const mapping of data) {
      dataNew = dataNew.replace(mapping.link1, mapping.link2);
    }

    return dataNew;
  }

  async getLink(file: any) {
    const dataOld = readFileSync(file.path, 'utf8');
    const links = extractLinksFromCode(dataOld);

    const dataCsv1 = [];
    const dataCsv2 = [];
    for (let i = 0; i < links.length; i++) {
      dataCsv1.push({
        link: links[i],
      });
      dataCsv2.push({
        link: await this.newLink(links[i]),
      });
    }

    const csvFilePath = 'csv1.xlsx';
    const csvWriter = createObjectCsvWriter({
      path: csvFilePath,
      header: [{ id: 'link', title: 'Liên kết gốc' }],
    });
    await csvWriter
      .writeRecords(dataCsv1)
      .then(() => {})
      .catch(() => {});

    const csvFilePath2 = 'csv2.xlsx';
    const csvWriter2 = createObjectCsvWriter({
      path: csvFilePath2,
      header: [{ id: 'link', title: 'Liên kết gốc' }],
    });
    await csvWriter2
      .writeRecords(dataCsv2)
      .then(() => {})
      .catch(() => {});

    return 'await this.customLink(file)';
  }
}

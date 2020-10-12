import {ExperimentsService} from './ExperimentsService'
import {HttpService} from './HttpService'
import expStub from './_stubs/exp-data'
import trialStub from './_stubs/trials-data'

jest.mock('./HttpService', () => jest.requireActual('./__mocks__/HttpService'))

describe('Service: ExperimentsService', () => {
  const expService = new ExperimentsService()
  const http = new HttpService()

  beforeEach(() => {
    http.get.mockReset()
    http.post.mockReset()
  })

  it('should have url property', () => {
    expect(expService).toHaveProperty('url')
    expect(expService.url).toBeTruthy()
  })

  describe('getExperimentsFactory', () => {
    it('should return array of 2 functions', () => {
      http.get.mockImplementationOnce(() => [() => {}, () => {}])
      const result = expService.getExperimentsFactory()
      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(2)
      expect(typeof result[0]).toBe('function')
      expect(typeof result[1]).toBe('function')
    })

    it('should successfully get experiments', async () => {
      http.get.mockImplementationOnce(() => {
        return [
          () =>
            Promise.resolve({
              json: () =>
                Promise.resolve({
                  ...expStub,
                }),
            }),
          () => {},
        ]
      })
      const [request] = expService.getExperimentsFactory()
      const expData = await request()
      expect(http.get).toHaveBeenCalledTimes(1)
      expect(http.get.mock.calls[0][0]).toMatchObject({
        url: '/v1/experiments/',
      })
      expect(expData).toMatchObject(expStub)
    })

    it('should ass id prperty to each experiment', async () => {
      http.get.mockImplementationOnce(() => {
        return [
          () =>
            Promise.resolve({
              json: () =>
                Promise.resolve({
                  ...expStub,
                }),
            }),
          () => {},
        ]
      })
      const [request] = expService.getExperimentsFactory()
      const expData = await request()
      expect(Array.isArray(expData.experiments)).toBe(true)
      expData.experiments.forEach(exp => {
        expect(exp).toHaveProperty('id')
        expect(exp._metadata.Link[0]).toContain(exp.id)
      })
    })

    it('should throw error if response undefined', async () => {
      http.get.mockImplementationOnce(() => {
        return [() => Promise.resolve(null), () => {}]
      })
      const [request] = expService.getExperimentsFactory()
      await expect(request()).rejects.toThrow(
        'Error in ExperimentsService.getExperiments',
      )
    })
  })

  describe('getTrialsFactory', () => {
    it('should return array of 2 functions', () => {
      http.get.mockImplementationOnce(() => [() => {}, () => {}])
      const result = expService.getTrialsFactory({name: 'postgres-experiment'})
      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(2)
      expect(typeof result[0]).toBe('function')
      expect(typeof result[1]).toBe('function')
    })

    it('should successfully get trials', async () => {
      http.get.mockImplementationOnce(() => {
        return [
          () =>
            Promise.resolve({
              json: () =>
                Promise.resolve({
                  ...trialStub,
                }),
            }),
          () => {},
        ]
      })
      const [request] = expService.getTrialsFactory({
        name: 'postgres-experiment',
      })
      const expData = await request()
      expect(http.get).toHaveBeenCalledTimes(1)
      expect(http.get.mock.calls[0][0]).toMatchObject({
        url: '/v1/experiments/postgres-experiment/trials/',
      })
      expect(expData).toMatchObject(trialStub)
    })

    it('should throw error if response undefined', async () => {
      http.get.mockImplementationOnce(() => {
        return [() => Promise.resolve(null), () => {}]
      })
      const [request] = expService.getTrialsFactory({
        name: 'postgres-experiment',
      })
      await expect(request()).rejects.toThrow(
        'Error in ExperimentsService.getTrials',
      )
    })
  })

  describe('postLabelToTrialFactory', () => {
    it('should return array of 2 functions', () => {
      http.post.mockImplementationOnce(() => [() => {}, () => {}])
      const result = expService.postLabelToTrialFactory({
        experimentId: 'postgres-experiment',
        trialId: 4,
        labels: {
          test: 'true',
        },
      })
      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(2)
      expect(typeof result[0]).toBe('function')
      expect(typeof result[1]).toBe('function')
    })

    it('should successfully post labels', async () => {
      http.post.mockImplementationOnce(() => {
        return [
          () =>
            Promise.resolve({
              status: 201,
              json: () =>
                Promise.resolve({
                  labels: {test: 'true'},
                }),
            }),
          () => {},
        ]
      })
      const [request] = expService.postLabelToTrialFactory({
        experimentId: 'postgres-experiment',
        trialId: 4,
        labels: {
          test: 'true',
        },
      })
      const expData = await request()
      expect(http.post).toHaveBeenCalledTimes(1)
      expect(http.post.mock.calls[0][0]).toMatchObject({
        url: '/v1/experiments/postgres-experiment/trials/4/labels',
      })
      expect(expData).toBe(true)
    })

    it('should throw error if response undefined', async () => {
      http.post.mockImplementationOnce(() => {
        return [() => Promise.resolve(null), () => {}]
      })
      const [request] = expService.postLabelToTrialFactory({
        experimentId: 'postgres-experiment',
        trialId: 4,
        labels: {
          test: 'true',
        },
      })
      await expect(request()).rejects.toThrow(
        'Error in ExperimentsService.postLabelToTrialFactory',
      )
    })

    it('should throw error if response status is not 200', async () => {
      http.post.mockImplementationOnce(() => {
        return [() => Promise.resolve({status: 400}), () => {}]
      })
      const [request] = expService.postLabelToTrialFactory({
        experimentId: 'postgres-experiment',
        trialId: 4,
        labels: {
          test: 'true',
        },
      })
      await expect(request()).rejects.toThrow('Error creating/deleting label')
    })
  })
})

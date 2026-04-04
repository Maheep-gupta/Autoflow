/**
 * Centralized API service layer for all backend calls
 * Handles request/response formatting and error handling
 */

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  status: number
}

class ApiService {
  private baseUrl: string = ''

  async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}/api${endpoint}`
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data)
      }

      const response = await fetch(url, options)
      const responseData = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: responseData.error || `API error: ${response.status}`,
          status: response.status,
        }
      }

      return {
        success: true,
        data: responseData,
        status: response.status,
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return {
        success: false,
        error: `Request failed: ${message}`,
        status: 500,
      }
    }
  }

  // Project APIs
  async getProject(projectId: string) {
    return this.request(`/projects/${projectId}`)
  }

  async getProjectWorkflows(projectId: string) {
    return this.request(`/projects/${projectId}/workflows`)
  }

  async getProjectMembers(projectId: string) {
    return this.request(`/projects/${projectId}/members`)
  }

  async inviteProjectMember(projectId: string, email: string, role: string) {
    return this.request('POST', `/projects/${projectId}/members`, { email, role })
  }

  async removeProjectMember(projectId: string, memberId: string) {
    return this.request('DELETE', `/projects/${projectId}/members/${memberId}`)
  }

  async updateMemberRole(projectId: string, memberId: string, role: string) {
    return this.request('PUT', `/projects/${projectId}/members/${memberId}`, { role })
  }

  // Workflow APIs
  async getWorkflow(workflowId: string) {
    return this.request(`/workflows/${workflowId}`)
  }

  async createWorkflow(projectId: string, data: {
    name: string
    description?: string
    nodes?: any[]
    edges?: any[]
  }) {
    return this.request('POST', '/workflows', {
      projectId,
      ...data,
    })
  }

  async updateWorkflow(workflowId: string, data: {
    name?: string
    description?: string
    status?: string
    nodes?: any[]
    edges?: any[]
  }) {
    return this.request('PUT', `/workflows/${workflowId}`, data)
  }

  async deleteWorkflow(workflowId: string) {
    return this.request('DELETE', `/workflows/${workflowId}`)
  }

  // Execution APIs
  async listExecutions(projectId: string, workflowId?: string) {
    let endpoint = `/executions?projectId=${projectId}`
    if (workflowId) {
      endpoint += `&workflowId=${workflowId}`
    }
    return this.request(endpoint)
  }

  async executeWorkflow(workflowId: string) {
    return this.request('POST', '/executions', { workflowId })
  }
}

export const apiService = new ApiService()

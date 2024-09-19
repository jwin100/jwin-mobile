const http = uni.$tn.http

export default {
  memberTagCreate (params) {
    return http.post('/merchant/member/tag', params)
  },
  memberTagEdit (id, params) {
    return http.put(`/merchant/member/tag/${id}`, params)
  },
  memberTagDelete (id) {
    return http.delete(`/merchant/member/tag/${id}`)
  },
  memberTagList () {
    return http.get('/merchant/gate/member/tag/list')
  },
  memberTagMapCreate (params) {
    return http.post('/merchant/member/tag-map', params)
  },
  memberTagMapDelete (memberId, tagId) {
    return http.delete(`/merchant/member/tag-map/${tagId}?memberId=${memberId}`)
  }
}

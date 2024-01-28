from auth import AuthError, requires_auth
from models.cohere import find_theme, make_post
from flask import Flask, jsonify, request
from flask_cors import CORS
from db.db import insert_profile, insert_posts, update_post_caption, update_post_date, update_post_status, select_posts
from models.instagram import createMediaObject, publishMedia, init_creds

app = Flask(__name__)
cors = CORS(app)

@app.errorhandler(400)
def bad_request(e):
    return jsonify({'API error': str(e)}), 400

@app.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response

@app.route('/profile', methods=['POST'])
@requires_auth
def profile():
    try:
        data = request.get_json()
        company_id = data.get('company_id')
        company = data.get('company')
        product = data.get('product')
        era = data.get('era')
        avenues = data.get('avenues')

        # save profile for campaign
        campaign_id = insert_profile(company, product, era, avenues)

        # generate theme
        theme = find_theme(company, product, era)

        # generate posts
        posts = make_post(theme, product, era)

        # save posts for campaign
        insert_posts(campaign_id, posts)

        return jsonify(
            id=campaign_id
        )
    except Exception as e:
        return bad_request(e)

@app.route('/campaign', methods=['GET'])
@requires_auth
def campaign():
    try:
        campaign_id = request.args.get('campaign_id')
        posts = select_posts(campaign_id)
       
        return jsonify(
            data=posts
        )
    except Exception as e:
        return bad_request(e)

@app.route('/save/date', methods=['POST'])
@requires_auth
def date():
    try:
        data = request.get_json()
        post_id = data.get('post_id')
        date = data.get('date')
        update_post_date(post_id, date)
        return jsonify({"success": True})
    except Exception as e:
        return bad_request(e)

@app.route('/save/caption', methods=['POST'])
@requires_auth
def caption():
    try:
        data = request.get_json()
        post_id = data.get('post_id')
        caption = data.get('caption')
        update_post_caption(post_id, caption)
        return jsonify({"success": True})
    except Exception as e:
        return bad_request(e)
    
@app.route('/save/status', methods=['POST'])
@requires_auth
def status():
    try:
        data = request.get_json()
        post_id = data.get('post_id')
        status = data.get('status')
        update_post_status(post_id, status)
        return jsonify({"success": True})
    except Exception as e:
        return bad_request(e)
    
@app.route('/instagram', methods=['POST'])
@requires_auth
def instagram_post():
    try:
        params = init_creds()
        data = request.get_json()

        params['media_type'] = data.get('media_type')
        params['media_url'] = data.get('media_url')
        params['caption'] = data.get('caption')

        imageMediaObjectResponse = createMediaObject( params ) # create a media object through the api
        publishImageResponse = publishMedia( imageMediaObjectResponse['id'], params ) # publish the media object you just create
        return publishImageResponse, 200
    except Exception as e:
        return bad_request(e)

if __name__ == '__main__':
    app.run(debug=True)
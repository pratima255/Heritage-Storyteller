from flask import Blueprint, request, jsonify
from extensions import db
from models.heritage_topic import HeritageTopic
from utils.auth_utils import admin_required

topics_bp = Blueprint('topics', __name__, url_prefix='/api/topics')

REGION_STATE_MAP = {
    'west india': ['Maharashtra'],
    'south india': ['Tamil Nadu'],
    'east india': ['Assam'],
    'north india': ['Jammu & Kashmir'],
    'central india': ['Madhya Pradesh']
}

STATE_REGION_MAP = {
    'maharashtra': 'West India',
    'tamil nadu': 'South India',
    'assam': 'East India',
    'jammu & kashmir': 'North India',
    'jammu and kashmir': 'North India',
    'madhya pradesh': 'Central India'
}

@topics_bp.route('', methods=['GET'])
def get_topics():
    category = request.args.get('category')
    state = request.args.get('state')
    region = request.args.get('region')
    search = request.args.get('search')

    query = HeritageTopic.query

    if category and category.lower() != 'all':
        query = query.filter(HeritageTopic.category.ilike(f"%{category}%"))

    if state:
        st_clean = state.strip().lower()
        if st_clean not in ['all', 'all regions', 'all states', 'all states & regions']:
            if st_clean in REGION_STATE_MAP:
                query = query.filter(HeritageTopic.state.in_(REGION_STATE_MAP[st_clean]))
            else:
                query = query.filter(HeritageTopic.state.ilike(f"%{state.strip()}%"))

    if region:
        reg_clean = region.strip().lower()
        if reg_clean not in ['all', 'all regions', 'all states', 'all states & regions']:
            if reg_clean in REGION_STATE_MAP:
                query = query.filter(HeritageTopic.state.in_(REGION_STATE_MAP[reg_clean]))
            elif reg_clean in STATE_REGION_MAP:
                query = query.filter(HeritageTopic.state.ilike(f"%{region.strip()}%"))
            else:
                query = query.filter(HeritageTopic.state.ilike(f"%{region.strip()}%"))

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (HeritageTopic.name.ilike(search_pattern)) |
            (HeritageTopic.description.ilike(search_pattern)) |
            (HeritageTopic.historical_background.ilike(search_pattern))
        )

    topics = query.all()
    return jsonify({
        'success': True,
        'count': len(topics),
        'data': [t.to_dict() for t in topics]
    }), 200


@topics_bp.route('/<id>', methods=['GET'])
def get_topic_by_id(id):
    topic = db.session.get(HeritageTopic, id)
    if not topic:
        return jsonify({'success': False, 'message': 'Topic not found'}), 404

    return jsonify({
        'success': True,
        'data': topic.to_dict(include_details=True)
    }), 200


@topics_bp.route('', methods=['POST'])
@admin_required()
def create_topic():
    data = request.get_json() or {}
    topic_id = data.get('id')
    name = data.get('name')
    category = data.get('category')
    state = data.get('state')
    description = data.get('description')

    if not name or not category or not state or not description:
        return jsonify({'success': False, 'message': 'Name, category, state and description are required'}), 400

    if not topic_id:
        topic_id = name.lower().replace(' ', '-').replace('&', 'and')

    existing = db.session.get(HeritageTopic, topic_id)
    if existing:
        return jsonify({'success': False, 'message': 'Topic with this ID already exists'}), 400

    topic = HeritageTopic(
        id=topic_id,
        name=name,
        category=category,
        state=state,
        description=description,
        historical_background=data.get('historical_background', ''),
        cover_image=data.get('cover_image', ''),
        status=data.get('status', 'Active')
    )

    db.session.add(topic)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Topic created successfully',
        'data': topic.to_dict()
    }), 201


@topics_bp.route('/<id>', methods=['PUT'])
@admin_required()
def update_topic(id):
    topic = db.session.get(HeritageTopic, id)
    if not topic:
        return jsonify({'success': False, 'message': 'Topic not found'}), 404

    data = request.get_json() or {}
    if 'name' in data:
        topic.name = data['name']
    if 'category' in data:
        topic.category = data['category']
    if 'state' in data:
        topic.state = data['state']
    if 'description' in data:
        topic.description = data['description']
    if 'historical_background' in data:
        topic.historical_background = data['historical_background']
    if 'cover_image' in data:
        topic.cover_image = data['cover_image']
    if 'status' in data:
        topic.status = data['status']

    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Topic updated successfully',
        'data': topic.to_dict()
    }), 200


@topics_bp.route('/<id>', methods=['DELETE'])
@admin_required()
def delete_topic(id):
    topic = db.session.get(HeritageTopic, id)
    if not topic:
        return jsonify({'success': False, 'message': 'Topic not found'}), 404

    db.session.delete(topic)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Topic deleted successfully'
    }), 200

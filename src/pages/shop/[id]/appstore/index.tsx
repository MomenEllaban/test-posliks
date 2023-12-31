import type { NextPage } from "next";
import { AdminLayout } from "@layout";
import Spinner from "react-bootstrap/Spinner";
import { Button, ButtonGroup, Card, Container, Row, Col } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import {
  ILocationSettings,
  IPageRules,
  ITokenVerfy,
} from "@models/common-model";
import {
  hasPermissions,
  keyValueRules,
  verifayTokens,
} from "src/pages/api/checkUtils";
import * as cookie from "cookie";
import { Toastify } from "src/libs/allToasts";
import { ToastContainer } from "react-toastify";
const AppStore: NextPage = (probs: any) => {
  const { shopId, rules } = probs;
  const [isLoading, setIsLoading] = useState(false);


  return (
    <>
      <AdminLayout shopId={shopId}>
        <ToastContainer />

        {!isLoading ? (
          <>
            <div className="page-content-style card">
              <Container fluid>
                <Row>
                  <Col xs={12} md={6} lg={4}>
                    <div>
                      <Row className="border mx-1 my-3 p-3">
                        <Col xs={4}>
                          <img
                            src={"https://placehold.co/600x400"}
                            width={"100%"}
                          />
                        </Col>
                        <Col xs={8}>
                          <h6>Title</h6>
                          <p>
                            Lorem ipsum dolor sit amet consectetur, adipisicing
                            elit. Dolorem accusantium laborum, sunt similique
                            voluptatum
                          </p>
                          <Button className="float-end">Install</Button>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col xs={12} md={6} lg={4}>
                    <div>
                      <Row className="border mx-1 my-3 p-3">
                        <Col xs={4}>
                          <img
                            src={"https://placehold.co/600x400"}
                            width={"100%"}
                          />
                        </Col>
                        <Col xs={8}>
                          <h6>Title</h6>
                          <p>
                            Lorem ipsum dolor sit amet consectetur, adipisicing
                            elit. Dolorem accusantium laborum, sunt similique
                            voluptatum
                          </p>
                          <Button className="float-end">Install</Button>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col xs={12} md={6} lg={4}>
                    <div>
                      <Row className="border mx-1 my-3 p-3">
                        <Col xs={4}>
                          <img
                            src={"https://placehold.co/600x400"}
                            width={"100%"}
                          />
                        </Col>
                        <Col xs={8}>
                          <h6>Title</h6>
                          <p>
                            Lorem ipsum dolor sit amet consectetur, adipisicing
                            elit. Dolorem accusantium laborum, sunt similique
                            voluptatum
                          </p>
                          <Button className="float-end">Install</Button>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col xs={12} md={6} lg={4}>
                    <div>
                      <Row className="border mx-1 my-3 p-3">
                        <Col xs={4}>
                          <img
                            src={"https://placehold.co/600x400"}
                            width={"100%"}
                          />
                        </Col>
                        <Col xs={8}>
                          <h6>Title</h6>
                          <p>
                            Lorem ipsum dolor sit amet consectetur, adipisicing
                            elit. Dolorem accusantium laborum, sunt similique
                            voluptatum
                          </p>
                          <Button className="float-end">Install</Button>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          </>
        ) : (
          <div className="d-flex justify-content-around">
            <Spinner animation="grow" />
          </div>
        )}
      </AdminLayout>
    </>
  );
};
export default AppStore;
export async function getServerSideProps(context: any) {
  const parsedCookies = cookie.parse(context.req.headers.cookie || "[]");
  var _isOk = true,
    _rule = true;
  //check page params
  var shopId = context.query.id;
  if (shopId == undefined)
    return { redirect: { permanent: false, destination: "/page403" } };

  //check user permissions
  var _userRules = {};
  await verifayTokens(
    { headers: { authorization: "Bearer " + parsedCookies.tokend } },
    (repo: ITokenVerfy) => {
      _isOk = repo.status;

      if (_isOk) {
        var _rules = keyValueRules(repo.data.rules || []);
        if (
          _rules[-2] != undefined &&
          _rules[-2][0].stuff != undefined &&
          _rules[-2][0].stuff == "owner"
        ) {
          _rule = true;
          _userRules = {
            hasDelete: true,
            hasEdit: true,
            hasView: true,
            hasInsert: true,
          };
        } else if (_rules[shopId] != undefined) {
          var _stuf = "";
          _rules[shopId].forEach((dd: any) => (_stuf += dd.stuff));
          const { userRules, hasPermission } = hasPermissions(
            _stuf,
            "products"
          );
          _rule = hasPermission;
          _userRules = userRules;
        } else _rule = false;
      }
    }
  );
  console.log("_isOk22    ", _isOk);
  if (!_isOk)
    return { redirect: { permanent: false, destination: "/user/login" } };
  if (!_rule)
    return { redirect: { permanent: false, destination: "/page403" } };
  return {
    props: { shopId: context.query.id, rules: _userRules },
  };
  //status ok
}
